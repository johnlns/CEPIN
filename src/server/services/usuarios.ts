import { drizzleDb } from '../db/drizzle'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const usuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'gestor', 'professor', 'responsavel']),
})

export type CreateUsuarioData = z.infer<typeof usuarioSchema>

export async function createUsuario(data: CreateUsuarioData) {
  const validatedData = usuarioSchema.parse(data)
  
  // Verificar se o email já existe
  const existente = await drizzleDb.query.users.findFirst({
    where: eq(users.email, validatedData.email)
  })
  
  if (existente) {
    throw new Error('Email já cadastrado no sistema')
  }

  const [usuario] = await drizzleDb.insert(users).values({
    ...validatedData,
  }).returning()

  return usuario
}

export async function getUsuarios() {
  return await drizzleDb.query.users.findMany({
    orderBy: (users, { asc }) => [asc(users.name)],
  })
}

export async function getUsuarioById(id: string) {
  return await drizzleDb.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export async function updateUsuario(id: string, data: Partial<CreateUsuarioData>) {
  const usuario = await getUsuarioById(id)
  
  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  // Se está alterando o email, verificar se não está em uso
  if (data.email && data.email !== usuario.email) {
    const emailEmUso = await drizzleDb.query.users.findFirst({
      where: eq(users.email, data.email)
    })
    
    if (emailEmUso) {
      throw new Error('Email já cadastrado no sistema')
    }
  }

  await drizzleDb.update(users)
    .set(data)
    .where(eq(users.id, id))

  return await getUsuarioById(id)
}

export async function deleteUsuario(id: string) {
  const usuario = await getUsuarioById(id)
  
  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  // Não permitir deletar o próprio usuário ou o último admin
  const admins = await drizzleDb.query.users.findMany({
    where: eq(users.role, 'admin')
  })

  if (usuario.role === 'admin' && admins.length === 1) {
    throw new Error('Não é possível deletar o último administrador do sistema')
  }

  await drizzleDb.delete(users).where(eq(users.id, id))

  return { success: true }
}


