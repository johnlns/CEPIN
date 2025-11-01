import { NextRequest, NextResponse } from 'next/server'
import { getCobrancas, createCobranca } from '@/server/services/financeiro'
import { getSession } from '@/server/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') || undefined
    const status = searchParams.get('status') as 'pendente' | 'pago' | 'cancelada' | undefined

    const cobrancas = await getCobrancas({ mes, status })
    
    return NextResponse.json({ success: true, cobrancas })
  } catch (error: any) {
    console.error('Erro ao buscar cobranças:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const cobranca = await createCobranca(data)
    
    return NextResponse.json({ success: true, cobranca }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar cobrança:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao criar cobrança' 
    }, { status: 400 })
  }
}

