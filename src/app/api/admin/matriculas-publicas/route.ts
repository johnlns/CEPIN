import { NextRequest, NextResponse } from 'next/server'
import { getMatriculasPublicas, updateMatriculaPublicaStatus } from '@/server/services/solicitacoes'
import { getSession } from '@/server/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const matriculas = await getMatriculasPublicas(status)
    
    return NextResponse.json({ success: true, matriculas })
  } catch (error: any) {
    console.error('Erro ao buscar matrículas públicas:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}


