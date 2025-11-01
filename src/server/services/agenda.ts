export interface HorarioDisponivel {
  id: string
  profissionalId: string
  profissionalNome: string
  modalidade: string
  diaSemana: number // 0 = domingo, 1 = segunda, etc.
  horaInicio: string // formato HH:MM
  horaFim: string // formato HH:MM
  capacidade: number
  ocupados: number
  ativo: boolean
}

export interface Agendamento {
  id: string
  horarioId: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone: string
  dataAgendamento: string // formato YYYY-MM-DD
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado'
  observacoes?: string
  criadoEm: string
}

// Dados de exemplo para demonstração
const HORARIOS_DISPONIVEIS: HorarioDisponivel[] = [
  // Segunda-feira
  {
    id: '1',
    profissionalId: 'prof1',
    profissionalNome: 'Ana Silva',
    modalidade: 'Natação',
    diaSemana: 1,
    horaInicio: '08:00',
    horaFim: '09:00',
    capacidade: 8,
    ocupados: 2,
    ativo: true
  },
  {
    id: '2',
    profissionalId: 'prof1',
    profissionalNome: 'Ana Silva',
    modalidade: 'Natação',
    diaSemana: 1,
    horaInicio: '09:00',
    horaFim: '10:00',
    capacidade: 8,
    ocupados: 5,
    ativo: true
  },
  {
    id: '3',
    profissionalId: 'prof2',
    profissionalNome: 'Carlos Santos',
    modalidade: 'Futebol',
    diaSemana: 1,
    horaInicio: '14:00',
    horaFim: '15:00',
    capacidade: 12,
    ocupados: 8,
    ativo: true
  },
  // Terça-feira
  {
    id: '4',
    profissionalId: 'prof1',
    profissionalNome: 'Ana Silva',
    modalidade: 'Natação',
    diaSemana: 2,
    horaInicio: '08:00',
    horaFim: '09:00',
    capacidade: 8,
    ocupados: 3,
    ativo: true
  },
  {
    id: '5',
    profissionalId: 'prof3',
    profissionalNome: 'Maria Oliveira',
    modalidade: 'Ballet',
    diaSemana: 2,
    horaInicio: '15:00',
    horaFim: '16:00',
    capacidade: 10,
    ocupados: 6,
    ativo: true
  },
  // Quarta-feira
  {
    id: '6',
    profissionalId: 'prof2',
    profissionalNome: 'Carlos Santos',
    modalidade: 'Futebol',
    diaSemana: 3,
    horaInicio: '14:00',
    horaFim: '15:00',
    capacidade: 12,
    ocupados: 4,
    ativo: true
  },
  {
    id: '7',
    profissionalId: 'prof1',
    profissionalNome: 'Ana Silva',
    modalidade: 'Natação',
    diaSemana: 3,
    horaInicio: '16:00',
    horaFim: '17:00',
    capacidade: 8,
    ocupados: 1,
    ativo: true
  },
  // Quinta-feira
  {
    id: '8',
    profissionalId: 'prof3',
    profissionalNome: 'Maria Oliveira',
    modalidade: 'Ballet',
    diaSemana: 4,
    horaInicio: '15:00',
    horaFim: '16:00',
    capacidade: 10,
    ocupados: 7,
    ativo: true
  },
  {
    id: '9',
    profissionalId: 'prof2',
    profissionalNome: 'Carlos Santos',
    modalidade: 'Futebol',
    diaSemana: 4,
    horaInicio: '16:00',
    horaFim: '17:00',
    capacidade: 12,
    ocupados: 3,
    ativo: true
  },
  // Sexta-feira
  {
    id: '10',
    profissionalId: 'prof1',
    profissionalNome: 'Ana Silva',
    modalidade: 'Natação',
    diaSemana: 5,
    horaInicio: '08:00',
    horaFim: '09:00',
    capacidade: 8,
    ocupados: 4,
    ativo: true
  },
  {
    id: '11',
    profissionalId: 'prof3',
    profissionalNome: 'Maria Oliveira',
    modalidade: 'Ballet',
    diaSemana: 5,
    horaInicio: '14:00',
    horaFim: '15:00',
    capacidade: 10,
    ocupados: 2,
    ativo: true
  },
  // Sábado
  {
    id: '12',
    profissionalId: 'prof2',
    profissionalNome: 'Carlos Santos',
    modalidade: 'Futebol',
    diaSemana: 6,
    horaInicio: '09:00',
    horaFim: '10:00',
    capacidade: 12,
    ocupados: 5,
    ativo: true
  },
  {
    id: '13',
    profissionalId: 'prof1',
    profissionalNome: 'Ana Silva',
    modalidade: 'Natação',
    diaSemana: 6,
    horaInicio: '10:00',
    horaFim: '11:00',
    capacidade: 8,
    ocupados: 3,
    ativo: true
  }
]

const AGENDAMENTOS_EXPERIMENTAIS: Agendamento[] = []

export class AgendaService {
  // Buscar horários disponíveis para uma modalidade específica
  static getHorariosDisponiveis(modalidade?: string): HorarioDisponivel[] {
    let horarios = HORARIOS_DISPONIVEIS.filter(h => h.ativo && h.ocupados < h.capacidade)
    
    if (modalidade) {
      horarios = horarios.filter(h => h.modalidade.toLowerCase() === modalidade.toLowerCase())
    }
    
    return horarios
  }

  // Buscar horários disponíveis para uma data específica
  static getHorariosDisponiveisPorData(data: string, modalidade?: string): HorarioDisponivel[] {
    const dataObj = new Date(data)
    const diaSemana = dataObj.getDay()
    
    let horarios = HORARIOS_DISPONIVEIS.filter(h => 
      h.ativo && 
      h.diaSemana === diaSemana && 
      h.ocupados < h.capacidade
    )
    
    if (modalidade) {
      horarios = horarios.filter(h => h.modalidade.toLowerCase() === modalidade.toLowerCase())
    }
    
    return horarios
  }

  // Verificar se um horário específico está disponível
  static isHorarioDisponivel(horarioId: string, data: string): boolean {
    const horario = HORARIOS_DISPONIVEIS.find(h => h.id === horarioId)
    if (!horario || !horario.ativo) return false
    
    // Verificar se já existe agendamento para este horário nesta data
    const agendamentoExistente = AGENDAMENTOS_EXPERIMENTAIS.find(a => 
      a.horarioId === horarioId && 
      a.dataAgendamento === data && 
      a.status !== 'cancelado'
    )
    
    return !agendamentoExistente && horario.ocupados < horario.capacidade
  }

  // Agendar aula experimental
  static agendarAulaExperimental(dados: {
    horarioId: string
    clienteNome: string
    clienteEmail: string
    clienteTelefone: string
    dataAgendamento: string
    observacoes?: string
  }): { success: boolean; message: string; agendamentoId?: string } {
    const horario = HORARIOS_DISPONIVEIS.find(h => h.id === dados.horarioId)
    
    if (!horario) {
      return { success: false, message: 'Horário não encontrado' }
    }
    
    if (!this.isHorarioDisponivel(dados.horarioId, dados.dataAgendamento)) {
      return { success: false, message: 'Horário não disponível' }
    }
    
    const novoAgendamento: Agendamento = {
      id: crypto.randomUUID(),
      horarioId: dados.horarioId,
      clienteNome: dados.clienteNome,
      clienteEmail: dados.clienteEmail,
      clienteTelefone: dados.clienteTelefone,
      dataAgendamento: dados.dataAgendamento,
      status: 'agendado',
      observacoes: dados.observacoes,
      criadoEm: new Date().toISOString()
    }
    
    AGENDAMENTOS_EXPERIMENTAIS.push(novoAgendamento)
    
    return { 
      success: true, 
      message: 'Aula experimental agendada com sucesso!',
      agendamentoId: novoAgendamento.id
    }
  }

  // Buscar agendamentos por período
  static getAgendamentos(profissionalId?: string, dataInicio?: string, dataFim?: string): Agendamento[] {
    let agendamentos = AGENDAMENTOS_EXPERIMENTAIS
    
    if (profissionalId) {
      const horariosProfissional = HORARIOS_DISPONIVEIS.filter(h => h.profissionalId === profissionalId)
      const horariosIds = horariosProfissional.map(h => h.id)
      agendamentos = agendamentos.filter(a => horariosIds.includes(a.horarioId))
    }
    
    if (dataInicio) {
      agendamentos = agendamentos.filter(a => a.dataAgendamento >= dataInicio)
    }
    
    if (dataFim) {
      agendamentos = agendamentos.filter(a => a.dataAgendamento <= dataFim)
    }
    
    return agendamentos
  }

  // Cancelar agendamento
  static cancelarAgendamento(agendamentoId: string): { success: boolean; message: string } {
    const agendamento = AGENDAMENTOS_EXPERIMENTAIS.find(a => a.id === agendamentoId)
    
    if (!agendamento) {
      return { success: false, message: 'Agendamento não encontrado' }
    }
    
    agendamento.status = 'cancelado'
    
    return { success: true, message: 'Agendamento cancelado com sucesso' }
  }

  // Obter modalidades disponíveis
  static getModalidadesDisponiveis(): string[] {
    const modalidades = [...new Set(HORARIOS_DISPONIVEIS.map(h => h.modalidade))]
    return modalidades.sort()
  }

  // Obter profissionais disponíveis
  static getProfissionaisDisponiveis(): { id: string; nome: string; modalidades: string[] }[] {
    const profissionaisMap = new Map<string, { nome: string; modalidades: Set<string> }>()
    
    HORARIOS_DISPONIVEIS.forEach(horario => {
      if (!profissionaisMap.has(horario.profissionalId)) {
        profissionaisMap.set(horario.profissionalId, {
          nome: horario.profissionalNome,
          modalidades: new Set()
        })
      }
      profissionaisMap.get(horario.profissionalId)!.modalidades.add(horario.modalidade)
    })
    
    return Array.from(profissionaisMap.entries()).map(([id, data]) => ({
      id,
      nome: data.nome,
      modalidades: Array.from(data.modalidades)
    }))
  }
}


