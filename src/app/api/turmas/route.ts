import { NextRequest, NextResponse } from 'next/server'
import { getTurmas, createTurma, getProfessores } from '@/server/services/turmas'
import { getSession } from '@/server/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const turmas = await getTurmas()
    
    return NextResponse.json({ success: true, turmas })
  } catch (error: any) {
    console.error('Erro ao buscar turmas:', error)
    return NextResponse.json({ success: false, message: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const turma = await createTurma(data)
    
    return NextResponse.json({ success: true, turma }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar turma:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao criar turma' 
    }, { status: 400 })
  }
}

