import { createClient } from '@libsql/client/node'
import { users } from '../src/server/db/schema'
import { drizzle } from 'drizzle-orm/libsql'

async function addUserProduction() {
  const email = process.argv[2]
  const name = process.argv[3]
  const role = (process.argv[4] || 'admin') as 'admin' | 'gestor' | 'professor' | 'responsavel'
  
  if (!email || !name) {
    console.error('❌ Uso correto:')
    console.log('   npm run add-user-prod "email@exemplo.com" "Nome Completo" "role"')
    console.log('')
    console.log('Roles disponíveis: admin, gestor, professor, responsavel')
    console.log('Exemplo: npm run add-user-prod "marina@cepin.com.br" "Marina Silva" "admin"')
    process.exit(1)
  }

  // Verificar se as variáveis de ambiente existem
  const dbUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
  const dbToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

  if (!dbUrl) {
    console.error('❌ Variável DATABASE_URL não encontrada!')
    console.log('Configure as variáveis de ambiente:')
    console.log('  DATABASE_URL="libsql://xxx.turso.io"')
    console.log('  DATABASE_AUTH_TOKEN="xxx"')
    console.log('')
    console.log('Ou defina-as temporariamente:')
    console.log('  $env:DATABASE_URL="libsql://xxx.turso.io"; $env:DATABASE_AUTH_TOKEN="xxx"; npm run add-user-prod ...')
    process.exit(1)
  }

  try {
    console.log('🔄 Conectando ao banco de produção...')
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Nome: ${name}`)
    console.log(`🔑 Role: ${role}`)
    console.log('')

    const client = createClient({
      url: dbUrl,
      authToken: dbToken,
    })

    const db = drizzle(client)
    
    const [user] = await db.insert(users).values({
      email,
      name,
      role,
    }).returning()

    console.log('✅ Usuário criado com sucesso no banco de PRODUÇÃO!')
    console.log('📧 Email:', user.email)
    console.log('👤 Nome:', user.name)
    console.log('🔑 Role:', user.role)
    console.log('')
    console.log('🎯 Agora ela pode fazer login em: cepin2-self.vercel.app')
    
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed') || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('⚠️  Usuário já existe no banco de produção!')
      console.log('✅ Marina já pode fazer login normalmente.')
    } else {
      console.error('❌ Erro ao criar usuário:', error.message)
      console.error('Detalhes:', error)
    }
  }
  
  process.exit(0)
}

addUserProduction()

