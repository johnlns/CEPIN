import { NextRequest, NextResponse } from 'next/server'
import { drizzleDb } from '@/server/db/drizzle'
import { despesasFixas } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/server/auth'
import { z } from 'zod'

const despesaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  valorCents: z.number().positive('Valor deve ser positivo'),
  diavencimento: z.number().min(1).max(31, 'Dia deve estar entre 1 e 31'),
})

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const despesas = await drizzleDb.query.despesasFixas.findMany({
      where: eq(despesasFixas.ativa, true),
      orderBy: (despesas, { asc }) => [asc(despesas.diavencimento)]
    })
    
    return NextResponse.json({ success: true, despesas })
  } catch (error: any) {
    console.error('Erro ao buscar despesas fixas:', error)
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

    const body = await request.json()
    const validatedData = despesaSchema.parse(body)

    const [despesa] = await drizzleDb.insert(despesasFixas).values({
      ...validatedData,
      ativa: true,
    }).returning()
    
    return NextResponse.json({ success: true, despesa }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar despesa fixa:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Erro ao criar despesa fixa' 
    }, { status: 400 })
  }
}

