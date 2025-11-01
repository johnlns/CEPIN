import { NextRequest, NextResponse } from 'next/server'
import { getUsuarios, createUsuario } from '@/server/services/usuarios'
import { getSession } from '@/server/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user || !['admin'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const usuarios = await getUsuarios()
    
    return NextResponse.json({ success: true, usuarios })
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json({ success: false, message: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || !['admin'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const usuario = await createUsuario(data)
    
    return NextResponse.json({ success: true, usuario }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao criar usuário' 
    }, { status: 400 })
  }
}


