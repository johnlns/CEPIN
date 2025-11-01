import { NextRequest, NextResponse } from 'next/server'
import { marcarCobrancaPaga } from '@/server/services/financeiro'
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
    const { acao } = await request.json()

    if (acao === 'marcar_pago') {
      const cobranca = await marcarCobrancaPaga(id)
      return NextResponse.json({ success: true, cobranca })
    }

    return NextResponse.json({ success: false, message: 'Ação inválida' }, { status: 400 })
  } catch (error: any) {
    console.error('Erro ao atualizar cobrança:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao atualizar cobrança' 
    }, { status: 400 })
  }
}

