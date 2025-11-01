import { drizzleDb } from '../db/drizzle'
import { 
  cobrancas, 
  boletimCaixa, 
  despesasFixas, 
  despesasFixasMensal, 
  alunos,
  matriculas,
  personalAgendas,
  vendasAvulsas
} from '../db/schema'
import { eq, and, gte, lte, desc, count, sum } from 'drizzle-orm'
import { z } from 'zod'

const cobrancaSchema = z.object({
  alunoId: z.string().uuid('ID do aluno inválido'),
  referencia: z.string().min(2, 'Referência deve ter pelo menos 2 caracteres'),
  origem: z.enum(['contraturno', 'personal', 'modalidade', 'avulso', 'pacote', 'ajuste']),
  valorCents: z.number().min(0, 'Valor deve ser positivo'),
})

export type CreateCobrancaData = z.infer<typeof cobrancaSchema>

const lancamentoCaixaSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  descricao: z.string().min(2, 'Descrição deve ter pelo menos 2 caracteres'),
  categoria: z.enum(['receita', 'despesa']),
  subcategoria: z.string().min(2, 'Subcategoria deve ter pelo menos 2 caracteres'),
  origem: z.enum(['contrato', 'avulso', 'personal', 'outros']),
  valorCents: z.number(),
  forma: z.enum(['pix', 'cartao', 'dinheiro', 'boleto', 'transferencia']),
  documentoRef: z.string().optional(),
  usuarioId: z.string().uuid('ID do usuário inválido').optional(),
})

export type CreateLancamentoCaixaData = z.infer<typeof lancamentoCaixaSchema>

// Cobranças
export async function createCobranca(data: CreateCobrancaData) {
  const validatedData = cobrancaSchema.parse(data)
  
  // Verificar se o aluno existe
  const aluno = await drizzleDb.query.alunos.findFirst({
    where: eq(alunos.id, validatedData.alunoId)
  })
  
  if (!aluno) {
    throw new Error('Aluno não encontrado')
  }

  const [cobranca] = await drizzleDb.insert(cobrancas).values({
    ...validatedData,
    status: 'pendente',
  }).returning()

  return cobranca
}

export async function getCobrancas() {
  return await drizzleDb.query.cobrancas.findMany({
    with: {
      aluno: true,
    },
    orderBy: (cobrancas, { desc }) => [desc(cobrancas.createdAt)],
  })
}

export async function getCobrancasByStatus(status: 'pendente' | 'pago' | 'cancelado') {
  return await drizzleDb.query.cobrancas.findMany({
    where: eq(cobrancas.status, status),
    with: {
      aluno: true,
    },
    orderBy: (cobrancas, { desc }) => [desc(cobrancas.createdAt)],
  })
}

export async function updateCobrancaStatus(id: string, status: 'pendente' | 'pago' | 'cancelado') {
  await drizzleDb.update(cobrancas)
    .set({ 
      status,
      paidAt: status === 'pago' ? new Date() : null,
    })
    .where(eq(cobrancas.id, id))

  return { success: true }
}

// Boletim de Caixa
export async function createLancamentoCaixa(data: CreateLancamentoCaixaData) {
  const validatedData = lancamentoCaixaSchema.parse(data)
  
  const [lancamento] = await drizzleDb.insert(boletimCaixa).values(validatedData).returning()
  
  return lancamento
}

export async function getBoletimCaixa(dataInicio?: string, dataFim?: string) {
  let whereConditions = undefined
  
  if (dataInicio && dataFim) {
    whereConditions = and(
      gte(boletimCaixa.data, dataInicio),
      lte(boletimCaixa.data, dataFim)
    )
  } else if (dataInicio) {
    whereConditions = gte(boletimCaixa.data, dataInicio)
  } else if (dataFim) {
    whereConditions = lte(boletimCaixa.data, dataFim)
  }

  return await drizzleDb.query.boletimCaixa.findMany({
    where: whereConditions,
    with: {
      usuario: {
        columns: {
          id: true,
          name: true,
        }
      },
    },
    orderBy: (boletim, { desc }) => [desc(boletim.data), desc(boletim.criadoEm)],
  })
}

export async function getResumoCaixa(dataInicio: string, dataFim: string) {
  const lancamentos = await getBoletimCaixa(dataInicio, dataFim)
  
  const receitas = lancamentos.filter(l => l.categoria === 'receita')
  const despesas = lancamentos.filter(l => l.categoria === 'despesa')
  
  const totalReceitas = receitas.reduce((sum, l) => sum + l.valorCents, 0)
  const totalDespesas = despesas.reduce((sum, l) => sum + l.valorCents, 0)
  
  return {
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    quantidadeLancamentos: lancamentos.length,
  }
}

// Contas Fixas
export async function createContaFixaModelo(data: {
  nome: string
  categoria: 'pessoal' | 'utilidades' | 'impostos' | 'negociacao' | 'reserva'
  valorPadraoCents: number
  vencimentoDia: number
  observacoes?: string
}) {
  const [modelo] = await drizzleDb.insert(despesasFixas).values({
    ...data,
  }).returning()

  return modelo
}

export async function getContasFixasModelo() {
  return await drizzleDb.query.despesasFixas.findMany({
    orderBy: (modelos, { asc }) => [asc(modelos.nome)],
  })
}

export async function gerarContasFixasMensal(referenciaMes: string) {
  // Verificar se já foram geradas para este mês
  const contasExistentes = await drizzleDb.query.despesasFixasMensal.findFirst({
    where: eq(despesasFixasMensal.referenciaMes, referenciaMes)
  })

  if (contasExistentes) {
    throw new Error('Contas fixas para este mês já foram geradas')
  }

  const modelos = await getContasFixasModelo()
  
  return await drizzleDb.transaction(async (tx) => {
    const contas = []
    
    for (const modelo of modelos) {
      const [ano, mes] = referenciaMes.split('-')
      const vencimento = `${ano}-${mes}-${modelo.vencimentoDia.toString().padStart(2, '0')}`
      
      const [conta] = await tx.insert(despesasFixasMensal).values({
        referenciaMes,
        despesaId: modelo.id,
        valorCents: modelo.valorPadraoCents,
        vencimento,
        status: 'aberto',
      }).returning()

      contas.push(conta)
    }

    return contas
  })
}

export async function getContasFixasMensal(referenciaMes: string) {
  return await drizzleDb.query.despesasFixasMensal.findMany({
    where: eq(despesasFixasMensal.referenciaMes, referenciaMes),
    with: {
      modelo: true,
    },
    orderBy: (contas, { asc }) => [asc(contas.vencimento)],
  })
}

export async function updateContaFixaStatus(id: string, status: 'aberto' | 'pago' | 'atrasado') {
  await drizzleDb.update(despesasFixasMensal)
    .set({ 
      status,
      pagoEm: status === 'pago' ? new Date() : null,
    })
    .where(eq(despesasFixasMensal.id, id))

  return { success: true }
}

// Gerar cobranças mensais automáticas
export async function gerarCobrancasMensais(referenciaMes: string) {
  const dataInicio = `${referenciaMes}-01`
  const dataFim = `${referenciaMes}-31`

  return await drizzleDb.transaction(async (tx) => {
    const cobrancasGeradas = []

    // Cobranças de matrículas ativas (modalidades)
    const matriculasAtivas = await tx.query.matriculas.findMany({
      where: eq(matriculas.status, 'ativa'),
      with: {
        aluno: true,
        turma: true,
      }
    })

    for (const matricula of matriculasAtivas) {
      // Aqui você pode implementar a lógica de cálculo do valor baseado no plano
      // Por simplicidade, vamos usar um valor fixo
      const valorCobranca = 15000 // R$ 150,00 em centavos

      const [cobranca] = await tx.insert(cobrancas).values({
        alunoId: matricula.alunoId,
        referencia: `${referenciaMes} - ${matricula.turma.nome}`,
        origem: 'modalidade',
        valorCents: valorCobranca,
        status: 'pendente',
      }).returning()

      cobrancasGeradas.push(cobranca)
    }

    return cobrancasGeradas
  })
}

export async function getEstatisticasFinanceiras(referenciaMes?: string) {
  const hoje = new Date().toISOString().split('T')[0]
  const mesAtual = referenciaMes || hoje.substring(0, 7) // YYYY-MM
  
  const cobrancasPendentes = await drizzleDb.select({ count: count() })
    .from(cobrancas)
    .where(eq(cobrancas.status, 'pendente'))

  const cobrancasPagas = await drizzleDb.select({ 
    count: count(),
    total: sum(cobrancas.valorCents)
  })
    .from(cobrancas)
    .where(eq(cobrancas.status, 'pago'))

  const contasFixasPendentes = await drizzleDb.select({ count: count() })
    .from(despesasFixasMensal)
    .where(eq(despesasFixasMensal.status, 'aberto'))

  return {
    cobrancasPendentes: cobrancasPendentes[0]?.count || 0,
    cobrancasPagas: cobrancasPagas[0]?.count || 0,
    valorTotalRecebido: cobrancasPagas[0]?.total || 0,
    contasFixasPendentes: contasFixasPendentes[0]?.count || 0,
  }
}
