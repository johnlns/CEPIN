import { drizzleDb } from './drizzle'
import { seedDatabase } from './seed'

async function migrate() {
  console.log('🔄 Iniciando migração do banco de dados...')
  
  try {
    // Executar seed
    await seedDatabase()
    
    console.log('✅ Migração concluída com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  migrate()
}

export { migrate }
