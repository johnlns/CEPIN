import { drizzleDb } from '../db/drizzle'
import { personalAgendas, personalFechamentos, personalFechamentoItens, alunos, users } from '../db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { z } from 'zod'
import { formatDate } from '@/lib/utils'

const agendaSchema = z.object({
  profissionalId: z.string().uuid('ID do profissional inválido'),
  alunoId: z.string().uuid('ID do aluno inválido'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  valorCents: z.number().min(0, 'Valor deve ser positivo'),
  pagador: z.enum(['unimed', 'particular']),
  observacoes: z.string().optional(),
})

export type CreateAgendaData = z.infer<typeof agendaSchema>

export async function createAgenda(data: CreateAgendaData) {
  const validatedData = agendaSchema.parse(data)
  
  // Verificar se o profissional existe
  const profissional = await drizzleDb.query.users.findFirst({
    where: eq(users.id, validatedData.profissionalId)
  })
  
  if (!profissional || profissional.role !== 'professor') {
    throw new Error('Profissional não encontrado ou inválido')
  }

  // Verificar se o aluno existe
  const aluno = await drizzleDb.query.alunos.findFirst({
    where: eq(alunos.id, validatedData.alunoId)
  })
  
  if (!aluno) {
    throw new Error('Aluno não encontrado')
  }

  // Verificar conflito de horário
  const conflito = await drizzleDb.query.personalAgendas.findFirst({
    where: and(
      eq(personalAgendas.profissionalId, validatedData.profissionalId),
      eq(personalAgendas.data, validatedData.data),
      eq(personalAgendas.status, 'agendado')
    )
  })

  if (conflito) {
    throw new Error('Profissional já tem agendamento neste horário')
  }

  const [agenda] = await drizzleDb.insert(personalAgendas).values({
    ...validatedData,
    status: 'agendado',
  }).returning()

  return agenda
}

export async function getAgendas() {
  return await drizzleDb.query.personalAgendas.findMany({
    with: {
      profissional: {
        columns: {
          id: true,
          name: true,
        }
      },
      aluno: true,
    },
    orderBy: (agendas, { desc }) => [desc(agendas.data), desc(agendas.startTime)],
  })
}

export async function getAgendasByProfissional(profissionalId: string, dataInicio?: string, dataFim?: string) {
  let whereConditions: ReturnType<typeof eq> | ReturnType<typeof and> = eq(personalAgendas.profissionalId, profissionalId)
  
  if (dataInicio) {
    whereConditions = and(whereConditions, gte(personalAgendas.data, dataInicio))!
  }
  
  if (dataFim) {
    whereConditions = and(whereConditions, lte(personalAgendas.data, dataFim))!
  }

  return await drizzleDb.query.personalAgendas.findMany({
    where: whereConditions,
    with: {
      aluno: true,
    },
    orderBy: (agendas, { asc }) => [asc(agendas.data), asc(agendas.startTime)],
  })
}

export async function updateAgendaStatus(id: string, status: 'feito' | 'faltou' | 'cancelado', observacoes?: string) {
  const agenda = await drizzleDb.query.personalAgendas.findFirst({
    where: eq(personalAgendas.id, id)
  })

  if (!agenda) {
    throw new Error('Agendamento não encontrado')
  }

  await drizzleDb.update(personalAgendas)
    .set({ 
      status,
      observacoes: observacoes || agenda.observacoes,
    })
    .where(eq(personalAgendas.id, id))

  return { success: true }
}

export async function getAgendasByPeriodo(dataInicio: string, dataFim: string) {
  return await drizzleDb.query.personalAgendas.findMany({
    where: and(
      gte(personalAgendas.data, dataInicio),
      lte(personalAgendas.data, dataFim)
    ),
    with: {
      profissional: {
        columns: {
          id: true,
          name: true,
        }
      },
      aluno: true,
    },
    orderBy: (agendas, { asc }) => [asc(agendas.data), asc(agendas.startTime)],
  })
}

export async function gerarFechamentoMensal(referenciaMes: string) {
  // Verificar se já existe fechamento para este mês
  const fechamentoExistente = await drizzleDb.query.personalFechamentos.findFirst({
    where: eq(personalFechamentos.referenciaMes, referenciaMes)
  })

  if (fechamentoExistente) {
    throw new Error('Fechamento para este mês já foi gerado')
  }

  // Calcular período do mês
  const dataInicio = `${referenciaMes}-01`
  const dataFim = `${referenciaMes}-31`

  // Buscar sessões realizadas no período
  const sessoes = await getAgendasByPeriodo(dataInicio, dataFim)
  const sessoesRealizadas = sessoes.filter(s => s.status === 'feito')

  // Agrupar por pagador
  const sessoesUnimed = sessoesRealizadas.filter(s => s.pagador === 'unimed')
  const sessoesParticular = sessoesRealizadas.filter(s => s.pagador === 'particular')

  return await drizzleDb.transaction(async (tx) => {
    const fechamentos = []

    // Fechamento Unimed
    if (sessoesUnimed.length > 0) {
      const valorTotalUnimed = sessoesUnimed.reduce((sum, s) => sum + s.valorCents, 0)
      
      const [fechamentoUnimed] = await tx.insert(personalFechamentos).values({
        referenciaMes,
        pagador: 'unimed',
        totalSessoes: sessoesUnimed.length,
        valorTotalCents: valorTotalUnimed,
        status: 'aberto',
      }).returning()

      // Criar itens do fechamento
      await tx.insert(personalFechamentoItens).values(
        sessoesUnimed.map(sessao => ({
          fechamentoId: fechamentoUnimed.id,
          agendaId: sessao.id,
          valorCents: sessao.valorCents,
        }))
      )

      fechamentos.push(fechamentoUnimed)
    }

    // Fechamento Particular
    if (sessoesParticular.length > 0) {
      const valorTotalParticular = sessoesParticular.reduce((sum, s) => sum + s.valorCents, 0)
      
      const [fechamentoParticular] = await tx.insert(personalFechamentos).values({
        referenciaMes,
        pagador: 'particular',
        totalSessoes: sessoesParticular.length,
        valorTotalCents: valorTotalParticular,
        status: 'aberto',
      }).returning()

      // Criar itens do fechamento
      await tx.insert(personalFechamentoItens).values(
        sessoesParticular.map(sessao => ({
          fechamentoId: fechamentoParticular.id,
          agendaId: sessao.id,
          valorCents: sessao.valorCents,
        }))
      )

      fechamentos.push(fechamentoParticular)
    }

    return fechamentos
  })
}

export async function getFechamentosMensais() {
  return await drizzleDb.query.personalFechamentos.findMany({
    orderBy: (fechamentos, { desc }) => [desc(fechamentos.referenciaMes)],
  })
}

export async function getFechamentoById(id: string) {
  return await drizzleDb.query.personalFechamentos.findFirst({
    where: eq(personalFechamentos.id, id),
    with: {
      itens: {
        with: {
          agenda: {
            with: {
              profissional: {
                columns: {
                  id: true,
                  name: true,
                }
              },
              aluno: true,
            }
          }
        }
      }
    }
  })
}

export async function atualizarStatusFechamento(id: string, status: 'faturado' | 'recebido', reciboUrl?: string) {
  await drizzleDb.update(personalFechamentos)
    .set({ 
      status,
      reciboUrl,
    })
    .where(eq(personalFechamentos.id, id))

  return { success: true }
}

export async function getEstatisticasPersonal() {
  const hoje = formatDate(new Date())
  
  const sessoesHoje = await drizzleDb.query.personalAgendas.findMany({
    where: and(
      eq(personalAgendas.data, hoje),
      eq(personalAgendas.status, 'agendado')
    ),
    with: {
      aluno: true,
    }
  })

  const sessoesRealizadas = await drizzleDb.query.personalAgendas.findMany({
    where: eq(personalAgendas.status, 'feito'),
    with: {
      aluno: true,
    }
  })

  const fechamentosPendentes = await drizzleDb.query.personalFechamentos.findMany({
    where: eq(personalFechamentos.status, 'aberto'),
  })

  return {
    sessoesHoje: sessoesHoje.length,
    sessoesRealizadas: sessoesRealizadas.length,
    fechamentosPendentes: fechamentosPendentes.length,
  }
}
