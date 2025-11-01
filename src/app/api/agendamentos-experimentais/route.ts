import { NextRequest, NextResponse } from 'next/server'
import { createAgendamentoExperimental } from '@/server/services/solicitacoes'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const agendamento = await createAgendamentoExperimental(data)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Aula experimental agendada com sucesso!',
      agendamento 
    })
  } catch (error: any) {
    console.error('Erro ao criar agendamento experimental:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Dados inválidos: ' + error.errors.map((e: any) => e.message).join(', ')
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}


