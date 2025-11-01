import { drizzleDb } from '../db/drizzle'
import { turmas, turmaHorarios, users } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const turmaSchema = z.object({
  esporte: z.string().min(2, 'Esporte deve ter pelo menos 2 caracteres'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  faixaEtaria: z.string().min(2, 'Faixa etária deve ter pelo menos 2 caracteres'),
  capacidade: z.number().min(1, 'Capacidade deve ser pelo menos 1'),
  professorId: z.string().uuid('ID do professor inválido'),
})

const horarioSchema = z.object({
  weekday: z.number().min(0).max(6, 'Dia da semana deve ser entre 0 e 6'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
})

const createTurmaSchema = z.object({
  turma: turmaSchema,
  horarios: z.array(horarioSchema).min(1, 'Deve ter pelo menos um horário'),
})

export type CreateTurmaData = z.infer<typeof createTurmaSchema>

export async function createTurma(data: CreateTurmaData) {
  const validatedData = createTurmaSchema.parse(data)
  
  return await drizzleDb.transaction(async (tx) => {
    // Criar turma
    const [turma] = await tx.insert(turmas).values({
      esporte: validatedData.turma.esporte,
      nome: validatedData.turma.nome,
      faixaEtaria: validatedData.turma.faixaEtaria,
      capacidade: validatedData.turma.capacidade,
      professorId: validatedData.turma.professorId,
    }).returning()

    // Criar horários
    await tx.insert(turmaHorarios).values(
      validatedData.horarios.map(horario => ({
        turmaId: turma.id,
        weekday: horario.weekday,
        startTime: horario.startTime,
        endTime: horario.endTime,
      }))
    )

    return turma
  })
}

export async function getTurmas() {
  return await drizzleDb.query.turmas.findMany({
    with: {
      horarios: true,
      professor: {
        columns: {
          id: true,
          name: true,
          email: true,
        }
      },
    },
    orderBy: (turmas, { asc }) => [asc(turmas.esporte), asc(turmas.nome)],
  })
}

export async function getTurmaById(id: string) {
  return await drizzleDb.query.turmas.findFirst({
    where: eq(turmas.id, id),
    with: {
      horarios: true,
      professor: {
        columns: {
          id: true,
          name: true,
          email: true,
        }
      },
    },
  })
}

export async function updateTurma(id: string, data: Partial<CreateTurmaData>) {
  const turma = await getTurmaById(id)
  if (!turma) {
    throw new Error('Turma não encontrada')
  }

  return await drizzleDb.transaction(async (tx) => {
    // Atualizar dados da turma
    if (data.turma) {
      await tx.update(turmas)
        .set(data.turma)
        .where(eq(turmas.id, id))
    }

    // Atualizar horários (remove todos e recria)
    if (data.horarios) {
      await tx.delete(turmaHorarios).where(eq(turmaHorarios.turmaId, id))
      
      if (data.horarios.length > 0) {
        await tx.insert(turmaHorarios).values(
          data.horarios.map(horario => ({
            turmaId: id,
            weekday: horario.weekday,
            startTime: horario.startTime,
            endTime: horario.endTime,
          }))
        )
      }
    }

    return await getTurmaById(id)
  })
}

export async function deleteTurma(id: string) {
  const turma = await getTurmaById(id)
  if (!turma) {
    throw new Error('Turma não encontrada')
  }

  await drizzleDb.transaction(async (tx) => {
    // Deletar horários
    await tx.delete(turmaHorarios).where(eq(turmaHorarios.turmaId, id))
    
    // Deletar turma
    await tx.delete(turmas).where(eq(turmas.id, id))
  })

  return { success: true }
}

export async function getTurmasByProfessor(professorId: string) {
  return await drizzleDb.query.turmas.findMany({
    where: eq(turmas.professorId, professorId),
    with: {
      horarios: true,
    },
    orderBy: (turmas, { asc }) => [asc(turmas.esporte), asc(turmas.nome)],
  })
}

export async function getHorariosByWeekday(weekday: number) {
  return await drizzleDb.query.turmaHorarios.findMany({
    where: eq(turmaHorarios.weekday, weekday),
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
      }
    },
    orderBy: (horarios, { asc }) => [asc(horarios.startTime)],
  })
}

export async function getProfessores() {
  return await drizzleDb.query.users.findMany({
    where: eq(users.role, 'professor'),
    columns: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: (users, { asc }) => [asc(users.name)],
  })
}
