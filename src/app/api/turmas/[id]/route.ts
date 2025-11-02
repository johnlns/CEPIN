import { NextRequest, NextResponse } from 'next/server'
import { getTurmaById, updateTurma, deleteTurma } from '@/server/services/turmas'
import { getSession } from '@/server/auth'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await context.params
    const turma = await getTurmaById(id)
    
    if (!turma) {
      return NextResponse.json({ success: false, message: 'Turma não encontrada' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, turma })
  } catch (error: any) {
    console.error('Erro ao buscar turma:', error)
    return NextResponse.json({ success: false, message: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await context.params
    const data = await request.json()
    
    const turma = await updateTurma(id, data)
    
    return NextResponse.json({ success: true, turma })
  } catch (error: any) {
    console.error('Erro ao atualizar turma:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao atualizar turma' 
    }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await context.params
    
    await deleteTurma(id)
    
    return NextResponse.json({ success: true, message: 'Turma deletada com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar turma:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao deletar turma' 
    }, { status: 400 })
  }
}

