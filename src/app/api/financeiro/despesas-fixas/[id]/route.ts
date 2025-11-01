import { NextRequest, NextResponse } from 'next/server'
import { drizzleDb } from '@/server/db/drizzle'
import { despesasFixas } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/server/auth'

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

    const [despesa] = await drizzleDb.update(despesasFixas)
      .set(data)
      .where(eq(despesasFixas.id, id))
      .returning()

    if (!despesa) {
      return NextResponse.json({ success: false, message: 'Despesa não encontrada' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, despesa })
  } catch (error: any) {
    console.error('Erro ao atualizar despesa:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao atualizar despesa' 
    }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await context.params

    // Marcar como inativa ao invés de deletar
    const [despesa] = await drizzleDb.update(despesasFixas)
      .set({ ativa: false })
      .where(eq(despesasFixas.id, id))
      .returning()

    if (!despesa) {
      return NextResponse.json({ success: false, message: 'Despesa não encontrada' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Despesa desativada com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar despesa:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao deletar despesa' 
    }, { status: 400 })
  }
}

