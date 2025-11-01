import { NextRequest, NextResponse } from 'next/server'
import { getAgendamentosExperimentais, updateAgendamentoExperimentalStatus } from '@/server/services/solicitacoes'
import { getSession } from '@/server/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const agendamentos = await getAgendamentosExperimentais(status)
    
    return NextResponse.json({ success: true, agendamentos })
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos experimentais:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}


