import { drizzleDb } from '../db/drizzle'
import { emailOtps, sessions, users } from '../db/schema'
import { eq, and, lt, gt } from 'drizzle-orm'
import { generateCode } from '@/lib/utils'
import { sendOTPEmail } from '../mailer'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import crypto from 'crypto'

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 dias

export async function requestOTP(email: string) {
  // Verificar se usuário existe
  const existingUser = await drizzleDb.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!existingUser) {
    throw new Error('Usuário não encontrado')
  }

  // Limpar OTPs expirados
  await drizzleDb.delete(emailOtps).where(
    and(
      eq(emailOtps.email, email),
      lt(emailOtps.expiresAt, new Date())
    )
  )

  // Gerar novo código
  const code = generateCode()
  const codeHash = crypto.createHash('sha256').update(code).digest('hex')
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

  // Salvar OTP
  await drizzleDb.insert(emailOtps).values({
    email,
    codeHash,
    expiresAt
  })

  // Enviar email
  await sendOTPEmail(email, code)

  return { success: true }
}

export async function verifyOTP(email: string, code: string) {
  const codeHash = crypto.createHash('sha256').update(code).digest('hex')
  
  // Buscar OTP válido
  const otp = await drizzleDb.query.emailOtps.findFirst({
    where: and(
      eq(emailOtps.email, email),
      eq(emailOtps.codeHash, codeHash),
      gt(emailOtps.expiresAt, new Date())
    )
  })

  if (!otp) {
    throw new Error('Código inválido ou expirado')
  }

  // Verificar tentativas
  if (otp.attempts >= 3) {
    throw new Error('Muitas tentativas. Solicite um novo código.')
  }

  // Incrementar tentativas
  await drizzleDb.update(emailOtps)
    .set({ attempts: otp.attempts + 1 })
    .where(eq(emailOtps.id, otp.id))

  // Buscar usuário
  const user = await drizzleDb.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  // Criar sessão
  const sessionToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await drizzleDb.insert(sessions).values({
    token: sessionToken,
    userId: user.id,
    expiresAt
  })

  // Limpar OTP usado
  await drizzleDb.delete(emailOtps).where(eq(emailOtps.id, otp.id))

  // Definir cookie
  const cookieStore = await cookies()
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: env.APP_URL.startsWith('https'),
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  })

  return { success: true, user }
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  if (sessionToken) {
    await drizzleDb.delete(sessions).where(eq(sessions.token, sessionToken))
  }

  cookieStore.delete('session')
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  if (!sessionToken) {
    return null
  }

  const session = await drizzleDb.query.sessions.findFirst({
    where: and(
      eq(sessions.token, sessionToken),
      gt(sessions.expiresAt, new Date())
    )
  })

  if (!session) {
    return null
  }

  // Buscar usuário separadamente
  const user = await drizzleDb.query.users.findFirst({
    where: eq(users.id, session.userId)
  })

  if (!user) {
    return null
  }

  return user
}

export function requireAuth(roles?: string[]) {
  return async function() {
    const user = await getSession()
    
    if (!user) {
      throw new Error('Não autorizado')
    }

    if (roles && !roles.includes(user.role)) {
      throw new Error('Acesso negado')
    }

    return user
  }
}
