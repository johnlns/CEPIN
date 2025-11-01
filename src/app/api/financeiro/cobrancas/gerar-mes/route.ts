import { NextRequest, NextResponse } from 'next/server'
import { gerarCobrancasMes } from '@/server/services/financeiro'
import { getSession } from '@/server/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { mes } = await request.json() // formato: YYYY-MM
    
    const cobrancas = await gerarCobrancasMes(mes)
    
    return NextResponse.json({ 
      success: true, 
      cobrancas,
      message: `${cobrancas.length} cobranças geradas com sucesso!` 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao gerar cobranças:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao gerar cobranças' 
    }, { status: 400 })
  }
}

