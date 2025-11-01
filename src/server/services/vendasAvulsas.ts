import { drizzleDb } from '../db/drizzle'
import { vendasAvulsas, pacoteConsumos, alunos } from '../db/schema'
import { eq, and, gte, lte, desc, count } from 'drizzle-orm'
import { z } from 'zod'

const vendaSchema = z.object({
  alunoId: z.string().uuid('ID do aluno inválido'),
  tipo: z.enum(['diaria', 'pacote']),
  referencia: z.string().min(2, 'Referência deve ter pelo menos 2 caracteres'),
  quantidade: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
  valorUnitCents: z.number().min(0, 'Valor unitário deve ser positivo'),
  valorTotalCents: z.number().min(0, 'Valor total deve ser positivo'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  observacoes: z.string().optional(),
})

export type CreateVendaData = z.infer<typeof vendaSchema>

export async function createVenda(data: CreateVendaData) {
  const validatedData = vendaSchema.parse(data)
  
  // Verificar se o aluno existe
  const aluno = await drizzleDb.query.alunos.findFirst({
    where: eq(alunos.id, validatedData.alunoId)
  })
  
  if (!aluno) {
    throw new Error('Aluno não encontrado')
  }

  // Validar se o valor total está correto
  const valorCalculado = validatedData.valorUnitCents * validatedData.quantidade
  if (validatedData.valorTotalCents !== valorCalculado) {
    throw new Error('Valor total não confere com quantidade x valor unitário')
  }

  const [venda] = await drizzleDb.insert(vendasAvulsas).values({
    ...validatedData,
    status: 'pendente',
  }).returning()

  return venda
}

export async function getVendas() {
  return await drizzleDb.query.vendasAvulsas.findMany({
    with: {
      aluno: true,
    },
    orderBy: (vendas, { desc }) => [desc(vendas.data)],
  })
}

export async function getVendasByAluno(alunoId: string) {
  return await drizzleDb.query.vendasAvulsas.findMany({
    where: eq(vendasAvulsas.alunoId, alunoId),
    orderBy: (vendas, { desc }) => [desc(vendas.data)],
  })
}

export async function updateVendaStatus(id: string, status: 'pendente' | 'pago' | 'cancelado') {
  await drizzleDb.update(vendasAvulsas)
    .set({ status })
    .where(eq(vendasAvulsas.id, id))

  return { success: true }
}

export async function getVendaById(id: string) {
  return await drizzleDb.query.vendasAvulsas.findFirst({
    where: eq(vendasAvulsas.id, id),
    with: {
      aluno: true,
      consumos: true,
    },
  })
}

export async function consumirDiaria(vendaId: string, alunoId: string, dataUso: string, turmaId?: string, observacao?: string) {
  const venda = await getVendaById(vendaId)
  
  if (!venda) {
    throw new Error('Venda não encontrada')
  }

  if (venda.tipo !== 'diaria') {
    throw new Error('Esta venda não é de diárias')
  }

  if (venda.status !== 'pago') {
    throw new Error('Venda deve estar paga para consumir diárias')
  }

  // Verificar se ainda há diárias disponíveis
  const consumosExistentes = await drizzleDb.query.pacoteConsumos.findMany({
    where: eq(pacoteConsumos.vendaId, vendaId)
  })

  if (consumosExistentes.length >= venda.quantidade) {
    throw new Error('Todas as diárias deste pacote já foram consumidas')
  }

  // Verificar se já consumiu nesta data
  const consumoData = await drizzleDb.query.pacoteConsumos.findFirst({
    where: and(
      eq(pacoteConsumos.vendaId, vendaId),
      eq(pacoteConsumos.dataUso, dataUso)
    )
  })

  if (consumoData) {
    throw new Error('Já foi consumida uma diária nesta data')
  }

  // Criar consumo
  const [consumo] = await drizzleDb.insert(pacoteConsumos).values({
    vendaId,
    alunoId,
    dataUso,
    turmaId,
    observacao,
  }).returning()

  return consumo
}

export async function getConsumosByVenda(vendaId: string) {
  return await drizzleDb.query.pacoteConsumos.findMany({
    where: eq(pacoteConsumos.vendaId, vendaId),
    with: {
      turma: true,
    },
    orderBy: (consumos, { desc }) => [desc(consumos.dataUso)],
  })
}

export async function getConsumosByAluno(alunoId: string, dataInicio?: string, dataFim?: string) {
  let whereConditions: ReturnType<typeof eq> | ReturnType<typeof and> = eq(pacoteConsumos.alunoId, alunoId)
  
  if (dataInicio) {
    whereConditions = and(whereConditions, gte(pacoteConsumos.dataUso, dataInicio))!
  }
  
  if (dataFim) {
    whereConditions = and(whereConditions, lte(pacoteConsumos.dataUso, dataFim))!
  }

  return await drizzleDb.query.pacoteConsumos.findMany({
    where: whereConditions,
    with: {
      venda: true,
      turma: true,
    },
    orderBy: (consumos, { desc }) => [desc(consumos.dataUso)],
  })
}

export async function getEstatisticasVendas() {
  const vendasPendentes = await drizzleDb.select({ count: count() })
    .from(vendasAvulsas)
    .where(eq(vendasAvulsas.status, 'pendente'))

  const vendasPagas = await drizzleDb.select({ count: count() })
    .from(vendasAvulsas)
    .where(eq(vendasAvulsas.status, 'pago'))

  const totalVendas = await drizzleDb.select({ count: count() })
    .from(vendasAvulsas)

  return {
    pendentes: vendasPendentes[0]?.count || 0,
    pagas: vendasPagas[0]?.count || 0,
    total: totalVendas[0]?.count || 0,
  }
}

export async function getPacotesAtivos() {
  return await drizzleDb.query.vendasAvulsas.findMany({
    where: and(
      eq(vendasAvulsas.tipo, 'diaria'),
      eq(vendasAvulsas.status, 'pago')
    ),
    with: {
      aluno: true,
      consumos: true,
    },
    orderBy: (vendas, { desc }) => [desc(vendas.data)],
  })
}

export async function getRelatorioConsumos(dataInicio: string, dataFim: string) {
  const consumos = await drizzleDb.query.pacoteConsumos.findMany({
    where: and(
      gte(pacoteConsumos.dataUso, dataInicio),
      lte(pacoteConsumos.dataUso, dataFim)
    ),
    with: {
      venda: {
        with: {
          aluno: true,
        }
      },
      turma: true,
    },
    orderBy: (consumos, { asc }) => [asc(consumos.dataUso)],
  })

  // Agrupar por data
  const consumosPorData = consumos.reduce((acc, consumo) => {
    const data = consumo.dataUso
    if (!acc[data]) {
      acc[data] = []
    }
    acc[data].push(consumo)
    return acc
  }, {} as Record<string, typeof consumos>)

  return {
    consumos,
    consumosPorData,
    totalConsumos: consumos.length,
  }
}
