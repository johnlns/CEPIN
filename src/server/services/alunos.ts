import { drizzleDb } from '../db/drizzle'
import { alunos, alunosSaude, autorizadosRetirada } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const alunoSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  notes: z.string().optional(),
})

const saudeSchema = z.object({
  possuiProblema: z.boolean().default(false),
  laudo: z.string().optional(),
  apoioEspecial: z.string().optional(),
  alergias: z.string().optional(),
  convenio: z.string().optional(),
  tipoSanguineo: z.string().optional(),
})

const autorizadoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  parentesco: z.string().min(2, 'Parentesco deve ter pelo menos 2 caracteres'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
})

const createAlunoSchema = z.object({
  aluno: alunoSchema,
  saude: saudeSchema.optional(),
  autorizados: z.array(autorizadoSchema).optional(),
})

export type CreateAlunoData = z.infer<typeof createAlunoSchema>

export async function createAluno(data: CreateAlunoData) {
  const validatedData = createAlunoSchema.parse(data)
  
  return await drizzleDb.transaction(async (tx) => {
    // Criar aluno
    const [aluno] = await tx.insert(alunos).values({
      fullName: validatedData.aluno.fullName,
      birthdate: validatedData.aluno.birthdate,
      notes: validatedData.aluno.notes,
    }).returning()

    // Criar dados de saúde se fornecidos
    if (validatedData.saude) {
      await tx.insert(alunosSaude).values({
        alunoId: aluno.id,
        ...validatedData.saude,
      })
    }

    // Criar autorizados se fornecidos
    if (validatedData.autorizados && validatedData.autorizados.length > 0) {
      await tx.insert(autorizadosRetirada).values(
        validatedData.autorizados.map(autorizado => ({
          alunoId: aluno.id,
          ...autorizado,
        }))
      )
    }

    return aluno
  })
}

export async function getAlunos() {
  return await drizzleDb.query.alunos.findMany({
    with: {
      saude: true,
      autorizados: true,
    },
    orderBy: (alunos, { asc }) => [asc(alunos.fullName)],
  })
}

export async function getAlunoById(id: string) {
  return await drizzleDb.query.alunos.findFirst({
    where: eq(alunos.id, id),
    with: {
      saude: true,
      autorizados: true,
    },
  })
}

export async function updateAluno(id: string, data: Partial<CreateAlunoData>) {
  const aluno = await getAlunoById(id)
  if (!aluno) {
    throw new Error('Aluno não encontrado')
  }

  return await drizzleDb.transaction(async (tx) => {
    // Atualizar dados básicos do aluno
    if (data.aluno) {
      await tx.update(alunos)
        .set(data.aluno)
        .where(eq(alunos.id, id))
    }

    // Atualizar dados de saúde
    if (data.saude) {
      if (aluno.saude) {
        await tx.update(alunosSaude)
          .set(data.saude)
          .where(eq(alunosSaude.alunoId, id))
      } else {
        await tx.insert(alunosSaude).values({
          alunoId: id,
          ...data.saude,
        })
      }
    }

    // Atualizar autorizados (remove todos e recria)
    if (data.autorizados) {
      await tx.delete(autorizadosRetirada).where(eq(autorizadosRetirada.alunoId, id))
      
      if (data.autorizados.length > 0) {
        await tx.insert(autorizadosRetirada).values(
          data.autorizados.map(autorizado => ({
            alunoId: id,
            ...autorizado,
          }))
        )
      }
    }

    return await getAlunoById(id)
  })
}

export async function deleteAluno(id: string) {
  const aluno = await getAlunoById(id)
  if (!aluno) {
    throw new Error('Aluno não encontrado')
  }

  await drizzleDb.transaction(async (tx) => {
    // Deletar autorizados
    await tx.delete(autorizadosRetirada).where(eq(autorizadosRetirada.alunoId, id))
    
    // Deletar dados de saúde
    await tx.delete(alunosSaude).where(eq(alunosSaude.alunoId, id))
    
    // Deletar aluno
    await tx.delete(alunos).where(eq(alunos.id, id))
  })

  return { success: true }
}

export async function searchAlunos(query: string) {
  return await drizzleDb.query.alunos.findMany({
    where: (alunos, { like }) => like(alunos.fullName, `%${query}%`),
    with: {
      saude: true,
      autorizados: true,
    },
    orderBy: (alunos, { asc }) => [asc(alunos.fullName)],
    limit: 20,
  })
}
