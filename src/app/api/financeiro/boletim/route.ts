import { NextRequest, NextResponse } from 'next/server'
import { getBoletimCaixa, registrarLancamento } from '@/server/services/financeiro'
import { getSession } from '@/server/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') || undefined
    const categoria = searchParams.get('categoria') as 'receita' | 'despesa' | undefined

    const boletim = await getBoletimCaixa({ mes, categoria })
    
    return NextResponse.json({ success: true, boletim })
  } catch (error: any) {
    console.error('Erro ao buscar boletim:', error)
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
    const lancamento = await registrarLancamento(data)
    
    return NextResponse.json({ success: true, lancamento }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar lançamento:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao criar lançamento' 
    }, { status: 400 })
  }
}

