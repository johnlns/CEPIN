import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Núcleo de Pessoas
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'gestor', 'professor', 'responsavel'] })
    .notNull().default('responsavel'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const alunos = sqliteTable('alunos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName: text('full_name').notNull(),
  birthdate: text('birthdate').notNull(), // ISO date string
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const alunosSaude = sqliteTable('alunos_saude', {
  alunoId: text('aluno_id').primaryKey().references(() => alunos.id, { onDelete: 'cascade' }),
  possuiProblema: integer('possui_problema', { mode: 'boolean' }).notNull().default(false),
  laudo: text('laudo'),
  apoioEspecial: text('apoio_especial'),
  alergias: text('alergias'),
  convenio: text('convenio'),
  tipoSanguineo: text('tipo_sanguineo'),
})

export const autorizadosRetirada = sqliteTable('autorizados_retirada', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  nome: text('nome').notNull(),
  parentesco: text('parentesco').notNull(),
  telefone: text('telefone').notNull(),
})

// Catálogos/Produtos
export const planos = sqliteTable('planos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tipo: text('tipo', { enum: ['contraturno', 'personal', 'modalidade', 'diaria', 'pacote'] }).notNull(),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  valorCents: integer('valor_cents').notNull(),
  periodicidade: text('periodicidade', { enum: ['mensal', 'avulso', 'pacote'] }).notNull(),
})

export const campanhasPrecos = sqliteTable('campanhas_precos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  planoId: text('plano_id').notNull().references(() => planos.id, { onDelete: 'cascade' }),
  nomeCampanha: text('nome_campanha').notNull(),
  regraJson: text('regra_json').notNull(), // JSON string para regras variáveis
  vigenteDe: text('vigente_de').notNull(), // ISO date string
  vigenteAte: text('vigente_ate').notNull(), // ISO date string
})

// Operação Acadêmica
export const turmas = sqliteTable('turmas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  esporte: text('esporte').notNull(),
  nome: text('nome').notNull(),
  faixaEtaria: text('faixa_etaria').notNull(),
  capacidade: integer('capacidade').notNull(),
  professorId: text('professor_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const turmaHorarios = sqliteTable('turma_horarios', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turmaId: text('turma_id').notNull().references(() => turmas.id, { onDelete: 'cascade' }),
  weekday: integer('weekday').notNull(), // 0-6 (domingo-sábado)
  startTime: text('start_time').notNull(), // 'HH:MM'
  endTime: text('end_time').notNull(), // 'HH:MM'
})

export const matriculas = sqliteTable('matriculas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  turmaId: text('turma_id').notNull().references(() => turmas.id, { onDelete: 'cascade' }),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['ativa', 'trancada', 'fila_espera', 'cancelada'] }).notNull().default('ativa'),
  startedAt: text('started_at').notNull(), // ISO date string
})

// Personal (DOR PRIORITÁRIA)
export const personalAgendas = sqliteTable('personal_agendas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profissionalId: text('profissional_id').notNull().references(() => users.id),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  data: text('data').notNull(), // ISO date string
  startTime: text('start_time').notNull(), // 'HH:MM'
  endTime: text('end_time').notNull(), // 'HH:MM'
  status: text('status', { enum: ['agendado', 'feito', 'faltou', 'cancelado'] }).notNull().default('agendado'),
  valorCents: integer('valor_cents').notNull(),
  pagador: text('pagador', { enum: ['unimed', 'particular'] }).notNull(),
  observacoes: text('observacoes'),
})

export const personalFechamentos = sqliteTable('personal_fechamentos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  referenciaMes: text('referencia_mes').notNull(), // 'YYYY-MM'
  pagador: text('pagador', { enum: ['unimed', 'particular'] }).notNull(),
  totalSessoes: integer('total_sessoes').notNull(),
  valorTotalCents: integer('valor_total_cents').notNull(),
  status: text('status', { enum: ['aberto', 'faturado', 'recebido'] }).notNull().default('aberto'),
  reciboUrl: text('recibo_url'),
})

export const personalFechamentoItens = sqliteTable('personal_fechamento_itens', {
  fechamentoId: text('fechamento_id').notNull().references(() => personalFechamentos.id, { onDelete: 'cascade' }),
  agendaId: text('agenda_id').notNull().references(() => personalAgendas.id, { onDelete: 'cascade' }),
  valorCents: integer('valor_cents').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.fechamentoId, table.agendaId] })
}))

// Diárias e Pacotes
export const vendasAvulsas = sqliteTable('vendas_avulsas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  tipo: text('tipo', { enum: ['diaria', 'pacote'] }).notNull(),
  referencia: text('referencia').notNull(), // ex: "Colônia de Férias Janeiro"
  quantidade: integer('quantidade').notNull(),
  valorUnitCents: integer('valor_unit_cents').notNull(),
  valorTotalCents: integer('valor_total_cents').notNull(),
  data: text('data').notNull(), // ISO date string
  status: text('status', { enum: ['pendente', 'pago', 'cancelado'] }).notNull().default('pendente'),
  observacoes: text('observacoes'),
})

export const pacoteConsumos = sqliteTable('pacote_consumos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendaId: text('venda_id').notNull().references(() => vendasAvulsas.id, { onDelete: 'cascade' }),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  dataUso: text('data_uso').notNull(), // ISO date string
  turmaId: text('turma_id').references(() => turmas.id), // nullable para uso livre
  observacao: text('observacao'),
})

// Financeiro & Caixa (DOR PRIORITÁRIA)
export const cobrancas = sqliteTable('cobrancas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  referencia: text('referencia').notNull(), // ex: "2024-01", "Personal Unimed"
  origem: text('origem', { enum: ['contraturno', 'personal', 'modalidade', 'avulso', 'pacote', 'ajuste'] }).notNull(),
  valorCents: integer('valor_cents').notNull(),
  status: text('status', { enum: ['pendente', 'pago', 'cancelado'] }).notNull().default('pendente'),
  mpPreferenceId: text('mp_preference_id'),
  mpPaymentId: text('mp_payment_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
})

export const boletimCaixa = sqliteTable('boletim_caixa', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  data: text('data').notNull(), // ISO date string
  descricao: text('descricao').notNull(),
  categoria: text('categoria', { enum: ['receita', 'despesa'] }).notNull(),
  subcategoria: text('subcategoria').notNull(),
  origem: text('origem', { enum: ['contrato', 'avulso', 'personal', 'outros'] }).notNull(),
  valorCents: integer('valor_cents').notNull(),
  forma: text('forma', { enum: ['pix', 'cartao', 'dinheiro', 'boleto', 'transferencia'] }).notNull(),
  documentoRef: text('documento_ref'),
  usuarioId: text('usuario_id').references(() => users.id),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Despesas Fixas - Baseado na imagem fornecida
export const despesasFixas = sqliteTable('despesas_fixas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  categoria: text('categoria', { 
    enum: ['pessoal', 'utilidades', 'impostos', 'negociacao', 'reserva'] 
  }).notNull(),
  valorPadraoCents: integer('valor_padrao_cents').notNull(),
  vencimentoDia: integer('vencimento_dia').notNull(), // 1-31
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  observacoes: text('observacoes'),
})

export const despesasFixasMensal = sqliteTable('despesas_fixas_mensal', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  referenciaMes: text('referencia_mes').notNull(), // 'YYYY-MM'
  despesaId: text('despesa_id').notNull().references(() => despesasFixas.id, { onDelete: 'cascade' }),
  valorCents: integer('valor_cents').notNull(),
  vencimento: text('vencimento').notNull(), // ISO date string
  status: text('status', { enum: ['aberto', 'pago', 'atrasado'] }).notNull().default('aberto'),
  pagoEm: integer('pago_em', { mode: 'timestamp' }),
  observacoes: text('observacoes'),
})

// Receitas Mensais - Baseado na imagem fornecida
export const receitasMensais = sqliteTable('receitas_mensais', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  referenciaMes: text('referencia_mes').notNull(), // 'YYYY-MM'
  categoria: text('categoria').notNull(), // ex: 'EM CAIXA', 'ACADEMIA', 'PERSONAL', etc.
  valorCents: integer('valor_cents').notNull(),
  observacoes: text('observacoes'),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Controle de Atendimentos - Baseado na imagem fornecida
export const atendimentos = sqliteTable('atendimentos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profissionalId: text('profissional_id').notNull().references(() => users.id),
  pacienteId: text('paciente_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  data: text('data').notNull(), // ISO date string
  valorSessaoCents: integer('valor_sessao_cents').notNull(),
  tipoPagamento: text('tipo_pagamento', { enum: ['unimed', 'particular', 'reembolso'] }).notNull(),
  status: text('status', { enum: ['agendado', 'realizado', 'faltou', 'cancelado'] }).notNull().default('agendado'),
  observacoes: text('observacoes'),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Boletim de Caixa - Baseado na imagem fornecida
export const boletimCaixaDetalhado = sqliteTable('boletim_caixa_detalhado', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  data: text('data').notNull(), // ISO date string
  evento: text('evento').notNull(),
  referencia: text('referencia'), // ex: 'B', 'C', 'A', 'D'
  tipoMovimento: text('tipo_movimento', { enum: ['entrada', 'saida'] }).notNull(),
  valorCents: integer('valor_cents').notNull(),
  observacoes: text('observacoes'),
  usuarioId: text('usuario_id').references(() => users.id),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Contratos & Documentos
export const contratos = sqliteTable('contratos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  alunoId: text('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  responsavelId: text('responsavel_id').notNull().references(() => users.id),
  tipo: text('tipo').notNull(),
  pdfUrl: text('pdf_url'),
  aceiteEm: integer('aceite_em', { mode: 'timestamp' }),
  ipAceite: text('ip_aceite'),
})

// Sessões, OTP, Sessões web
export const sessions = sqliteTable('sessions', {
  token: text('token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const emailOtps = sqliteTable('email_otps', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  codeHash: text('code_hash').notNull(),
  attempts: integer('attempts').notNull().default(0),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Relações para queries
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Aluno = typeof alunos.$inferSelect
export type NewAluno = typeof alunos.$inferInsert
export type Turma = typeof turmas.$inferSelect
export type NewTurma = typeof turmas.$inferInsert
export type Matricula = typeof matriculas.$inferSelect
export type NewMatricula = typeof matriculas.$inferInsert
export type PersonalAgenda = typeof personalAgendas.$inferSelect
export type NewPersonalAgenda = typeof personalAgendas.$inferInsert
export type VendaAvulsa = typeof vendasAvulsas.$inferSelect
export type NewVendaAvulsa = typeof vendasAvulsas.$inferInsert
export type Cobranca = typeof cobrancas.$inferSelect
export type NewCobranca = typeof cobrancas.$inferInsert
export type BoletimCaixa = typeof boletimCaixa.$inferSelect
export type NewBoletimCaixa = typeof boletimCaixa.$inferInsert

// Novos tipos para controle admin
export type DespesaFixa = typeof despesasFixas.$inferSelect
export type NewDespesaFixa = typeof despesasFixas.$inferInsert
export type DespesaFixaMensal = typeof despesasFixasMensal.$inferSelect
export type NewDespesaFixaMensal = typeof despesasFixasMensal.$inferInsert
// Matrículas Públicas (Site sem login)
export const matriculasPublicas = sqliteTable('matriculas_publicas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nomeAluno: text('nome_aluno').notNull(),
  dataNascimento: text('data_nascimento').notNull(), // ISO date string
  nomeResponsavel: text('nome_responsavel').notNull(),
  telefoneResponsavel: text('telefone_responsavel').notNull(),
  emailResponsavel: text('email_responsavel'),
  endereco: text('endereco'),
  observacoes: text('observacoes'),
  modalidadeId: text('modalidade_id').notNull(),
  modalidadeNome: text('modalidade_nome').notNull(),
  status: text('status', { enum: ['pendente', 'aprovada', 'rejeitada', 'processada'] }).notNull().default('pendente'),
  observacoesAdmin: text('observacoes_admin'),
  processadoEm: integer('processado_em', { mode: 'timestamp' }),
  processadoPor: text('processado_por').references(() => users.id),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Agendamentos Experimentais (Site sem login)
export const agendamentosExperimentais = sqliteTable('agendamentos_experimentais', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clienteNome: text('cliente_nome').notNull(),
  clienteEmail: text('cliente_email').notNull(),
  clienteTelefone: text('cliente_telefone').notNull(),
  nomeCrianca: text('nome_crianca').notNull(),
  idadeCrianca: text('idade_crianca').notNull(),
  modalidadeInteresse: text('modalidade_interesse').notNull(),
  dataPreferencia: text('data_preferencia').notNull(), // ISO date string
  horarioSelecionado: text('horario_selecionado').notNull(),
  observacoes: text('observacoes'),
  status: text('status', { enum: ['pendente', 'confirmado', 'realizado', 'cancelado'] }).notNull().default('pendente'),
  observacoesAdmin: text('observacoes_admin'),
  processadoEm: integer('processado_em', { mode: 'timestamp' }),
  processadoPor: text('processado_por').references(() => users.id),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type ReceitaMensal = typeof receitasMensais.$inferSelect
export type NewReceitaMensal = typeof receitasMensais.$inferInsert
export type Atendimento = typeof atendimentos.$inferSelect
export type NewAtendimento = typeof atendimentos.$inferInsert
export type BoletimCaixaDetalhado = typeof boletimCaixaDetalhado.$inferSelect
export type NewBoletimCaixaDetalhado = typeof boletimCaixaDetalhado.$inferInsert
export type MatriculaPublica = typeof matriculasPublicas.$inferSelect
export type NewMatriculaPublica = typeof matriculasPublicas.$inferInsert
export type AgendamentoExperimental = typeof agendamentosExperimentais.$inferSelect
export type NewAgendamentoExperimental = typeof agendamentosExperimentais.$inferInsert
