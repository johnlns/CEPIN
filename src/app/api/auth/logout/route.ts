import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/server/auth'

export async function POST(request: NextRequest) {
  try {
    await logout()

    return NextResponse.redirect(new URL('/login', request.url))
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
