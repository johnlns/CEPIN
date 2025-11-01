import { NextRequest, NextResponse } from 'next/server'
import { updateAgendamentoExperimentalStatus } from '@/server/services/solicitacoes'
import { getSession } from '@/server/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { status, observacoesAdmin } = await request.json()
    const { id } = await params

    if (!status || !['pendente', 'confirmado', 'realizado', 'cancelado'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Status inválido' 
      }, { status: 400 })
    }

    await updateAgendamentoExperimentalStatus(id, status as any, observacoesAdmin, user.id)
    
    return NextResponse.json({ success: true, message: 'Agendamento atualizado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento experimental:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

