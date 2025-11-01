import { drizzleDb } from './drizzle'
import { 
  users, 
  alunos, 
  alunosSaude, 
  autorizadosRetirada,
  turmas,
  turmaHorarios,
  planos,
  despesasFixas,
  vendasAvulsas,
  personalAgendas
} from './schema'

export async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...')

  try {
    // 1. Criar usuários
    console.log('👥 Criando usuários...')
    const [admin] = await drizzleDb.insert(users).values({
      email: 'admin@academiainfantil.com',
      name: 'Administrador',
      role: 'admin',
    }).returning()

    const [gestor] = await drizzleDb.insert(users).values({
      email: 'gestor@academiainfantil.com',
      name: 'João Gestor',
      role: 'gestor',
    }).returning()

    const [professor1] = await drizzleDb.insert(users).values({
      email: 'professor1@academiainfantil.com',
      name: 'Maria Silva',
      role: 'professor',
    }).returning()

    const [professor2] = await drizzleDb.insert(users).values({
      email: 'professor2@academiainfantil.com',
      name: 'Carlos Santos',
      role: 'professor',
    }).returning()

    // 2. Criar alunos
    console.log('👶 Criando alunos...')
    const [aluno1] = await drizzleDb.insert(alunos).values({
      fullName: 'Ana Clara Silva',
      birthdate: '2018-05-15',
      notes: 'Aluna dedicada e participativa',
    }).returning()

    const [aluno2] = await drizzleDb.insert(alunos).values({
      fullName: 'Pedro Henrique Costa',
      birthdate: '2017-03-22',
      notes: 'Muito ativo, gosta de esportes',
    }).returning()

    // 3. Dados de saúde dos alunos
    console.log('🏥 Criando dados de saúde...')
    await drizzleDb.insert(alunosSaude).values([
      {
        alunoId: aluno1.id,
        possuiProblema: false,
        alergias: 'Nenhuma',
        convenio: 'Unimed',
        tipoSanguineo: 'A+',
      },
      {
        alunoId: aluno2.id,
        possuiProblema: true,
        laudo: 'Asma leve',
        apoioEspecial: 'Inalador sempre disponível',
        alergias: 'Pólen',
        convenio: 'Particular',
        tipoSanguineo: 'O+',
      }
    ])

    // 4. Autorizados para retirada
    console.log('👨‍👩‍👧‍👦 Criando autorizados...')
    await drizzleDb.insert(autorizadosRetirada).values([
      {
        alunoId: aluno1.id,
        nome: 'Maria Silva',
        parentesco: 'Mãe',
        telefone: '11999999999',
      },
      {
        alunoId: aluno1.id,
        nome: 'José Silva',
        parentesco: 'Pai',
        telefone: '11999999998',
      },
      {
        alunoId: aluno2.id,
        nome: 'Carla Costa',
        parentesco: 'Mãe',
        telefone: '11999999997',
      }
    ])

    // 5. Criar planos
    console.log('📋 Criando planos...')
    const [planoContraturno] = await drizzleDb.insert(planos).values({
      tipo: 'contraturno',
      nome: 'Contraturno Completo',
      descricao: 'Acompanhamento pedagógico + atividades recreativas + refeições',
      valorCents: 35000, // R$ 350,00
      periodicidade: 'mensal',
    }).returning()

    const [planoPersonal] = await drizzleDb.insert(planos).values({
      tipo: 'personal',
      nome: 'Personal Training',
      descricao: 'Atendimento individualizado com professor especializado',
      valorCents: 8000, // R$ 80,00 por sessão
      periodicidade: 'avulso',
    }).returning()

    const [planoFutebol] = await drizzleDb.insert(planos).values({
      tipo: 'modalidade',
      nome: 'Futebol Infantil',
      descricao: 'Aulas de futebol para crianças de 6 a 12 anos',
      valorCents: 12000, // R$ 120,00
      periodicidade: 'mensal',
    }).returning()

    // 6. Criar turmas
    console.log('⚽ Criando turmas...')
    const [turma1] = await drizzleDb.insert(turmas).values({
      esporte: 'Futebol',
      nome: 'Futebol Sub-10',
      faixaEtaria: '6-10 anos',
      capacidade: 15,
      professorId: professor1.id,
    }).returning()

    const [turma2] = await drizzleDb.insert(turmas).values({
      esporte: 'Natação',
      nome: 'Natação Iniciante',
      faixaEtaria: '4-8 anos',
      capacidade: 12,
      professorId: professor2.id,
    }).returning()

    // 7. Criar horários das turmas
    console.log('🕐 Criando horários...')
    await drizzleDb.insert(turmaHorarios).values([
      // Futebol - Segunda e Quarta às 14h
      { turmaId: turma1.id, weekday: 1, startTime: '14:00', endTime: '15:00' },
      { turmaId: turma1.id, weekday: 3, startTime: '14:00', endTime: '15:00' },
      // Natação - Terça e Quinta às 15h
      { turmaId: turma2.id, weekday: 2, startTime: '15:00', endTime: '16:00' },
      { turmaId: turma2.id, weekday: 4, startTime: '15:00', endTime: '16:00' },
    ])

    // 8. Criar despesas fixas
    console.log('💰 Criando despesas fixas...')
    await drizzleDb.insert(despesasFixas).values([
      {
        nome: 'Aluguel do Espaço',
        categoria: 'utilidades',
        valorPadraoCents: 250000, // R$ 2.500,00
        vencimentoDia: 5,
      },
      {
        nome: 'Energia Elétrica',
        categoria: 'utilidades',
        valorPadraoCents: 80000, // R$ 800,00
        vencimentoDia: 15,
      },
      {
        nome: 'Internet',
        categoria: 'utilidades',
        valorPadraoCents: 12000, // R$ 120,00
        vencimentoDia: 10,
      }
    ])

    // 9. Criar venda de pacote de diárias
    console.log('🎫 Criando venda de pacote...')
    const [vendaPacote] = await drizzleDb.insert(vendasAvulsas).values({
      alunoId: aluno1.id,
      tipo: 'diaria',
      referencia: 'Colônia de Férias Janeiro',
      quantidade: 5,
      valorUnitCents: 2500, // R$ 25,00 por diária
      valorTotalCents: 12500, // R$ 125,00 total
      data: '2024-01-15',
      status: 'pago',
      observacoes: 'Pacote para colônia de férias',
    }).returning()

    // 10. Criar algumas sessões de personal
    console.log('🏃‍♂️ Criando sessões de personal...')
    await drizzleDb.insert(personalAgendas).values([
      {
        profissionalId: professor1.id,
        alunoId: aluno1.id,
        data: '2024-01-20',
        startTime: '09:00',
        endTime: '10:00',
        status: 'feito',
        valorCents: 8000, // R$ 80,00
        pagador: 'unimed',
        observacoes: 'Sessão de adaptação, aluno se adaptou bem',
      },
      {
        profissionalId: professor1.id,
        alunoId: aluno2.id,
        data: '2024-01-22',
        startTime: '10:00',
        endTime: '11:00',
        status: 'feito',
        valorCents: 8000,
        pagador: 'particular',
        observacoes: 'Exercícios respiratórios devido à asma',
      },
      {
        profissionalId: professor2.id,
        alunoId: aluno1.id,
        data: '2024-01-25',
        startTime: '09:00',
        endTime: '10:00',
        status: 'faltou',
        valorCents: 8000,
        pagador: 'unimed',
        observacoes: 'Aluno faltou sem aviso',
      }
    ])

    console.log('✅ Seed concluído com sucesso!')
    console.log('\n📊 Resumo dos dados criados:')
    console.log('👥 Usuários: 4 (1 admin, 1 gestor, 2 professores)')
    console.log('👶 Alunos: 2')
    console.log('📋 Planos: 3')
    console.log('⚽ Turmas: 2 (com horários)')
    console.log('💰 Despesas Fixas: 3 modelos')
    console.log('🎫 Vendas: 1 pacote de diárias')
    console.log('🏃‍♂️ Sessões Personal: 3')
    console.log('\n🔑 Credenciais de acesso:')
    console.log('Admin: admin@academiainfantil.com')
    console.log('Gestor: gestor@academiainfantil.com')
    console.log('Professor 1: professor1@academiainfantil.com')
    console.log('Professor 2: professor2@academiainfantil.com')

  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    throw error
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro ao executar seed:', error)
      process.exit(1)
    })
}
