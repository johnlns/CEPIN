import { NextRequest, NextResponse } from 'next/server'
import { requestOTP } from '@/server/auth'
import { z } from 'zod'

const requestOTPSchema = z.object({
  email: z.string().email('Email inválido'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = requestOTPSchema.parse(body)

    await requestOTP(email)

    return NextResponse.json({ 
      success: true, 
      message: 'Código enviado para seu email' 
    })
  } catch (error) {
    console.error('Erro ao solicitar OTP:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 400 }
    )
  }
}
