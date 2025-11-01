import { drizzleDb } from '../db/drizzle'
import { matriculas, turmas, alunos } from '../db/schema'
import { eq, and, count } from 'drizzle-orm'
import { z } from 'zod'

const matriculaSchema = z.object({
  turmaId: z.string().uuid('ID da turma inválido'),
  alunoId: z.string().uuid('ID do aluno inválido'),
  status: z.enum(['ativa', 'trancada', 'fila_espera', 'cancelada']).default('ativa'),
  startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
})

export type CreateMatriculaData = z.infer<typeof matriculaSchema>

export async function createMatricula(data: CreateMatriculaData) {
  const validatedData = matriculaSchema.parse(data)
  
  // Verificar se a turma existe
  const turma = await drizzleDb.query.turmas.findFirst({
    where: eq(turmas.id, validatedData.turmaId)
  })
  
  if (!turma) {
    throw new Error('Turma não encontrada')
  }

  // Verificar se o aluno existe
  const aluno = await drizzleDb.query.alunos.findFirst({
    where: eq(alunos.id, validatedData.alunoId)
  })
  
  if (!aluno) {
    throw new Error('Aluno não encontrado')
  }

  // Verificar se já existe matrícula ativa para este aluno nesta turma
  const matriculaExistente = await drizzleDb.query.matriculas.findFirst({
    where: and(
      eq(matriculas.turmaId, validatedData.turmaId),
      eq(matriculas.alunoId, validatedData.alunoId),
      eq(matriculas.status, 'ativa')
    )
  })

  if (matriculaExistente) {
    throw new Error('Aluno já está matriculado nesta turma')
  }

  // Verificar capacidade da turma
  const matriculasAtivas = await drizzleDb.select({ count: count() })
    .from(matriculas)
    .where(and(
      eq(matriculas.turmaId, validatedData.turmaId),
      eq(matriculas.status, 'ativa')
    ))

  const capacidadeOcupada = matriculasAtivas[0]?.count || 0
  
  if (capacidadeOcupada >= turma.capacidade) {
    // Se a turma está cheia, colocar na fila de espera
    validatedData.status = 'fila_espera'
  }

  const [matricula] = await drizzleDb.insert(matriculas).values(validatedData).returning()
  
  return matricula
}

export async function getMatriculas() {
  return await drizzleDb.query.matriculas.findMany({
    with: {
      turma: {
        with: {
          professor: {
            columns: {
              id: true,
              name: true,
            }
          }
        }
      },
      aluno: true,
    },
    orderBy: (matriculas, { asc }) => [asc(matriculas.startedAt)],
  })
}

export async function getMatriculasByTurma(turmaId: string) {
  return await drizzleDb.query.matriculas.findMany({
    where: eq(matriculas.turmaId, turmaId),
    with: {
      aluno: true,
    },
    orderBy: (matriculas, { asc }) => [asc(matriculas.status), asc(matriculas.startedAt)],
  })
}

export async function getMatriculasByAluno(alunoId: string) {
  return await drizzleDb.query.matriculas.findMany({
    where: eq(matriculas.alunoId, alunoId),
    with: {
      turma: {
        with: {
          professor: {
            columns: {
              id: true,
              name: true,
            }
          },
          horarios: true,
        }
      },
    },
    orderBy: (matriculas, { asc }) => [asc(matriculas.startedAt)],
  })
}

export async function updateMatriculaStatus(id: string, status: 'ativa' | 'trancada' | 'fila_espera' | 'cancelada') {
  const matricula = await drizzleDb.query.matriculas.findFirst({
    where: eq(matriculas.id, id),
    with: {
      turma: true,
    }
  })

  if (!matricula) {
    throw new Error('Matrícula não encontrada')
  }

  // Se está ativando uma matrícula, verificar capacidade
  if (status === 'ativa') {
    const matriculasAtivas = await drizzleDb.select({ count: count() })
      .from(matriculas)
      .where(and(
        eq(matriculas.turmaId, matricula.turmaId),
        eq(matriculas.status, 'ativa')
      ))

    const capacidadeOcupada = matriculasAtivas[0]?.count || 0
    
    if (capacidadeOcupada >= matricula.turma.capacidade) {
      throw new Error('Turma já está na capacidade máxima')
    }
  }

  await drizzleDb.update(matriculas)
    .set({ status })
    .where(eq(matriculas.id, id))

  // Se ativou uma matrícula, verificar se há alguém na fila de espera
  if (status === 'ativa') {
    const proximoFila = await drizzleDb.query.matriculas.findFirst({
      where: and(
        eq(matriculas.turmaId, matricula.turmaId),
        eq(matriculas.status, 'fila_espera')
      ),
      orderBy: (matriculas, { asc }) => [asc(matriculas.startedAt)]
    })

    if (proximoFila) {
      await drizzleDb.update(matriculas)
        .set({ status: 'ativa' })
        .where(eq(matriculas.id, proximoFila.id))
    }
  }

  return { success: true }
}

export async function deleteMatricula(id: string) {
  const matricula = await drizzleDb.query.matriculas.findFirst({
    where: eq(matriculas.id, id)
  })

  if (!matricula) {
    throw new Error('Matrícula não encontrada')
  }

  await drizzleDb.delete(matriculas).where(eq(matriculas.id, id))

  // Se era uma matrícula ativa, ativar próxima da fila
  if (matricula.status === 'ativa') {
    const proximoFila = await drizzleDb.query.matriculas.findFirst({
      where: and(
        eq(matriculas.turmaId, matricula.turmaId),
        eq(matriculas.status, 'fila_espera')
      ),
      orderBy: (matriculas, { asc }) => [asc(matriculas.startedAt)]
    })

    if (proximoFila) {
      await drizzleDb.update(matriculas)
        .set({ status: 'ativa' })
        .where(eq(matriculas.id, proximoFila.id))
    }
  }

  return { success: true }
}

export async function getEstatisticasMatriculas() {
  const totalMatriculas = await drizzleDb.select({ count: count() }).from(matriculas)
  const matriculasAtivas = await drizzleDb.select({ count: count() })
    .from(matriculas)
    .where(eq(matriculas.status, 'ativa'))
  const filaEspera = await drizzleDb.select({ count: count() })
    .from(matriculas)
    .where(eq(matriculas.status, 'fila_espera'))

  return {
    total: totalMatriculas[0]?.count || 0,
    ativas: matriculasAtivas[0]?.count || 0,
    filaEspera: filaEspera[0]?.count || 0,
  }
}
