import { NextResponse } from 'next/server'
import { getProfessores } from '@/server/services/turmas'
import { getSession } from '@/server/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const professores = await getProfessores()
    
    return NextResponse.json({ success: true, professores })
  } catch (error: any) {
    console.error('Erro ao buscar professores:', error)
    return NextResponse.json({ success: false, message: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

