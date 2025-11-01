import { NextRequest, NextResponse } from 'next/server'
import { AgendaService } from '@/server/services/agenda'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modalidade = searchParams.get('modalidade')
    const data = searchParams.get('data')
    
    let horarios
    
    if (data) {
      horarios = AgendaService.getHorariosDisponiveisPorData(data, modalidade || undefined)
    } else {
      horarios = AgendaService.getHorariosDisponiveis(modalidade || undefined)
    }
    
    return NextResponse.json({
      success: true,
      horarios,
      total: horarios.length
    })
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { horarioId, clienteNome, clienteEmail, clienteTelefone, dataAgendamento, observacoes } = body
    
    // Validar dados obrigatórios
    if (!horarioId || !clienteNome || !clienteEmail || !clienteTelefone || !dataAgendamento) {
      return NextResponse.json(
        { success: false, message: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }
    
    const resultado = AgendaService.agendarAulaExperimental({
      horarioId,
      clienteNome,
      clienteEmail,
      clienteTelefone,
      dataAgendamento,
      observacoes
    })
    
    if (!resultado.success) {
      return NextResponse.json(
        { success: false, message: resultado.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: resultado.message,
      agendamentoId: resultado.agendamentoId
    })
  } catch (error) {
    console.error('Erro ao agendar aula experimental:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


