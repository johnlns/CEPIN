import { drizzleDb } from '../db/drizzle'
import { matriculasPublicas, agendamentosExperimentais, users } from '../db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { z } from 'zod'

// Schema de validação para matrícula pública
const matriculaPublicaSchema = z.object({
  nomeAluno: z.string().min(1, 'Nome do aluno é obrigatório'),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  nomeResponsavel: z.string().min(1, 'Nome do responsável é obrigatório'),
  telefoneResponsavel: z.string().min(1, 'Telefone é obrigatório'),
  emailResponsavel: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  modalidadeId: z.string().min(1, 'Modalidade é obrigatória'),
  modalidadeNome: z.string().min(1, 'Nome da modalidade é obrigatório'),
})

// Schema de validação para agendamento experimental
const agendamentoExperimentalSchema = z.object({
  clienteNome: z.string().min(1, 'Nome do cliente é obrigatório'),
  clienteEmail: z.string().email('Email inválido'),
  clienteTelefone: z.string().min(1, 'Telefone é obrigatório'),
  nomeCrianca: z.string().min(1, 'Nome da criança é obrigatório'),
  idadeCrianca: z.string().min(1, 'Idade da criança é obrigatória'),
  modalidadeInteresse: z.string().min(1, 'Modalidade é obrigatória'),
  dataPreferencia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  horarioSelecionado: z.string().min(1, 'Horário é obrigatório'),
  observacoes: z.string().optional(),
})

export type CreateMatriculaPublicaData = z.infer<typeof matriculaPublicaSchema>
export type CreateAgendamentoExperimentalData = z.infer<typeof agendamentoExperimentalSchema>

// Funções para matrículas públicas
export async function createMatriculaPublica(data: CreateMatriculaPublicaData) {
  const validatedData = matriculaPublicaSchema.parse(data)
  
  const [matricula] = await drizzleDb.insert(matriculasPublicas).values({
    ...validatedData,
    emailResponsavel: validatedData.emailResponsavel || null,
    endereco: validatedData.endereco || null,
    observacoes: validatedData.observacoes || null,
  }).returning()
  
  return matricula
}

export async function getMatriculasPublicas(status?: string) {
  const query = drizzleDb.query.matriculasPublicas.findMany({
    orderBy: [desc(matriculasPublicas.criadoEm)],
    with: {
      processadoPor: {
        columns: {
          name: true,
          email: true,
        }
      }
    }
  })

  if (status) {
    return drizzleDb.query.matriculasPublicas.findMany({
      where: eq(matriculasPublicas.status, status as any),
      orderBy: [desc(matriculasPublicas.criadoEm)],
      with: {
        processadoPor: {
          columns: {
            name: true,
            email: true,
          }
        }
      }
    })
  }

  return query
}

export async function updateMatriculaPublicaStatus(
  id: string, 
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'processada',
  observacoesAdmin?: string,
  processadoPor?: string
) {
  const updateData: any = { status }
  
  if (observacoesAdmin) {
    updateData.observacoesAdmin = observacoesAdmin
  }
  
  if (processadoPor) {
    updateData.processadoPor = processadoPor
    updateData.processadoEm = new Date()
  }

  await drizzleDb.update(matriculasPublicas)
    .set(updateData)
    .where(eq(matriculasPublicas.id, id))

  return { success: true }
}

// Funções para agendamentos experimentais
export async function createAgendamentoExperimental(data: CreateAgendamentoExperimentalData) {
  const validatedData = agendamentoExperimentalSchema.parse(data)
  
  const [agendamento] = await drizzleDb.insert(agendamentosExperimentais).values({
    ...validatedData,
    observacoes: validatedData.observacoes || null,
  }).returning()
  
  return agendamento
}

export async function getAgendamentosExperimentais(status?: string) {
  const query = drizzleDb.query.agendamentosExperimentais.findMany({
    orderBy: [desc(agendamentosExperimentais.criadoEm)],
    with: {
      processadoPor: {
        columns: {
          name: true,
          email: true,
        }
      }
    }
  })

  if (status) {
    return drizzleDb.query.agendamentosExperimentais.findMany({
      where: eq(agendamentosExperimentais.status, status as any),
      orderBy: [desc(agendamentosExperimentais.criadoEm)],
      with: {
        processadoPor: {
          columns: {
            name: true,
            email: true,
          }
        }
      }
    })
  }

  return query
}

export async function updateAgendamentoExperimentalStatus(
  id: string, 
  status: 'pendente' | 'confirmado' | 'realizado' | 'cancelado',
  observacoesAdmin?: string,
  processadoPor?: string
) {
  const updateData: any = { status }
  
  if (observacoesAdmin) {
    updateData.observacoesAdmin = observacoesAdmin
  }
  
  if (processadoPor) {
    updateData.processadoPor = processadoPor
    updateData.processadoEm = new Date()
  }

  await drizzleDb.update(agendamentosExperimentais)
    .set(updateData)
    .where(eq(agendamentosExperimentais.id, id))

  return { success: true }
}

// Funções para estatísticas
export async function getEstatisticasSolicitacoes() {
  const [matriculasPendentes] = await drizzleDb
    .select({ count: count() })
    .from(matriculasPublicas)
    .where(eq(matriculasPublicas.status, 'pendente'))

  const [agendamentosPendentes] = await drizzleDb
    .select({ count: count() })
    .from(agendamentosExperimentais)
    .where(eq(agendamentosExperimentais.status, 'pendente'))

  return {
    matriculasPendentes: matriculasPendentes?.count || 0,
    agendamentosPendentes: agendamentosPendentes?.count || 0,
    totalPendentes: (matriculasPendentes?.count || 0) + (agendamentosPendentes?.count || 0)
  }
}


