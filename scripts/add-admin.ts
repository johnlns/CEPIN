import { drizzleDb } from '../src/server/db/drizzle'
import { users } from '../src/server/db/schema'

async function addAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Por favor, forneça um email:')
    console.log('   npm run add-admin seu-email@exemplo.com')
    process.exit(1)
  }

  try {
    console.log(`🔄 Adicionando usuário admin: ${email}`)
    
    const [user] = await drizzleDb.insert(users).values({
      email,
      name: 'Administrador',
      role: 'admin',
    }).returning()

    console.log('✅ Usuário criado com sucesso!')
    console.log('📧 Email:', user.email)
    console.log('👤 Nome:', user.name)
    console.log('🔑 Role:', user.role)
    console.log('')
    console.log('🎯 Agora você pode fazer login com:', email)
    
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.log('⚠️  Usuário já existe!')
    } else {
      console.error('❌ Erro ao criar usuário:', error.message)
    }
  }
  
  process.exit(0)
}

addAdmin()


