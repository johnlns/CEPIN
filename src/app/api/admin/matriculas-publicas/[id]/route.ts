import { NextRequest, NextResponse } from 'next/server'
import { updateMatriculaPublicaStatus } from '@/server/services/solicitacoes'
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

    if (!status || !['pendente', 'aprovada', 'rejeitada', 'processada'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Status inválido' 
      }, { status: 400 })
    }

    await updateMatriculaPublicaStatus(id, status as any, observacoesAdmin, user.id)
    
    return NextResponse.json({ success: true, message: 'Matrícula atualizada com sucesso' })
  } catch (error: any) {
    console.error('Erro ao atualizar matrícula pública:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

