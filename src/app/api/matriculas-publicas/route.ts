import { NextRequest, NextResponse } from 'next/server'
import { createMatriculaPublica } from '@/server/services/solicitacoes'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const matricula = await createMatriculaPublica(data)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Matrícula solicitada com sucesso! Entraremos em contato em breve.',
      matricula 
    })
  } catch (error: any) {
    console.error('Erro ao criar matrícula pública:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Dados inválidos: ' + error.errors.map((e: any) => e.message).join(', ')
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}


