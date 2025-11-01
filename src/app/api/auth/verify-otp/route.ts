import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/server/auth'
import { z } from 'zod'

const verifyOTPSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = verifyOTPSchema.parse(body)

    const result = await verifyOTP(email, code)

    return NextResponse.json({ 
      success: true, 
      message: 'Login realizado com sucesso',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      }
    })
  } catch (error) {
    console.error('Erro ao verificar OTP:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 400 }
    )
  }
}
