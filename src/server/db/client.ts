import { createClient } from '@libsql/client/node'
import { env } from '@/lib/env'

export const db = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
})
