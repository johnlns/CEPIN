import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function resetDatabase() {
  console.log('🔄 Limpando banco de dados Turso...')

  try {
    // Desabilitar foreign keys temporariamente
    await client.execute('PRAGMA foreign_keys = OFF')
    console.log('🔓 Foreign keys desabilitadas')

    // Listar todas as tabelas (incluindo as temporárias do drizzle)
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table'
    `)

    console.log(`📊 Encontradas ${tables.rows.length} tabelas`)

    // Deletar todas as tabelas
    for (const row of tables.rows) {
      const tableName = row.name as string
      try {
        console.log(`🗑️  Deletando tabela: ${tableName}`)
        await client.execute(`DROP TABLE IF EXISTS "${tableName}"`)
      } catch (err) {
        console.log(`⚠️  Ignorando erro ao deletar ${tableName}`)
      }
    }

    // Reabilitar foreign keys
    await client.execute('PRAGMA foreign_keys = ON')
    console.log('🔒 Foreign keys reabilitadas')

    console.log('✅ Banco de dados limpo com sucesso!')
    console.log('📝 Agora execute: npx drizzle-kit push --config=drizzle.config.prod.ts')
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error)
    process.exit(1)
  }

  process.exit(0)
}

resetDatabase()

