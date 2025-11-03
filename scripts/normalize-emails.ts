import { createClient } from '@libsql/client/node'
import { users } from '../src/server/db/schema'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'

async function normalizeEmails() {
  // Verificar se as variáveis de ambiente existem
  const dbUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
  const dbToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

  if (!dbUrl) {
    console.error('❌ Variável DATABASE_URL não encontrada!')
    console.log('Configure as variáveis de ambiente:')
    console.log('  DATABASE_URL="libsql://xxx.turso.io"')
    console.log('  DATABASE_AUTH_TOKEN="xxx"')
    process.exit(1)
  }

  try {
    console.log('🔄 Conectando ao banco de produção...')
    console.log('')

    const client = createClient({
      url: dbUrl,
      authToken: dbToken,
    })

    const db = drizzle(client)
    
    // Buscar todos os usuários
    const allUsers = await db.select().from(users)
    
    console.log(`📊 Encontrados ${allUsers.length} usuários`)
    console.log('')

    let updatedCount = 0

    for (const user of allUsers) {
      const normalizedEmail = user.email.toLowerCase().trim()
      
      if (user.email !== normalizedEmail) {
        console.log(`📧 Normalizando: ${user.email} → ${normalizedEmail}`)
        
        await db.update(users)
          .set({ email: normalizedEmail })
          .where(eq(users.id, user.id))
        
        updatedCount++
      }
    }

    console.log('')
    console.log(`✅ ${updatedCount} email(s) normalizado(s) com sucesso!`)
    console.log(`⏭️  ${allUsers.length - updatedCount} email(s) já estavam corretos`)
    console.log('')
    console.log('🎯 Agora Marina pode fazer login com qualquer combinação de maiúsculas/minúsculas!')
    
  } catch (error: any) {
    console.error('❌ Erro ao normalizar emails:', error.message)
    console.error('Detalhes:', error)
  }
  
  process.exit(0)
}

normalizeEmails()

