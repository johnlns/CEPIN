import 'dotenv/config'

function ensureEnv() {
  // Vars mínimas exigidas por src/lib/env.ts
  if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:dev.db'
  if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'dev-secret-dev-secret-dev-secret-123'

  // SMTP: se não houver, o mailer entra em modo DEV (apenas log)
  if (!process.env.SMTP_HOST) process.env.SMTP_HOST = ''
  if (!process.env.SMTP_PORT) process.env.SMTP_PORT = '587'
  if (!process.env.SMTP_USER) process.env.SMTP_USER = 'dev@example.com'
  if (!process.env.SMTP_PASS) process.env.SMTP_PASS = ''
}

async function main() {
  ensureEnv()
  const { sendWelcomeEmail } = await import('./index')

  const email = 'lennonserafim@gmail.com'
  const name = 'Teste de Envio'
  try {
    await sendWelcomeEmail(email, name)
    console.log(`[OK] E-mail de boas-vindas enviado para ${email}`)
  } catch (err) {
    console.error('[ERRO] Falha ao enviar e-mail:', err)
    process.exitCode = 1
  }
}

main()


