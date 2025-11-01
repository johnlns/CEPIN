import { NextRequest, NextResponse } from 'next/server'
import { updateUsuario, deleteUsuario } from '@/server/services/usuarios'
import { getSession } from '@/server/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    
    const usuario = await updateUsuario(id, data)
    
    return NextResponse.json({ success: true, usuario })
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao atualizar usuário' 
    }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    
    // Não permitir que o usuário delete a si mesmo
    if (id === user.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Você não pode deletar sua própria conta' 
      }, { status: 400 })
    }
    
    await deleteUsuario(id)
    
    return NextResponse.json({ success: true, message: 'Usuário deletado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao deletar usuário' 
    }, { status: 400 })
  }
}


