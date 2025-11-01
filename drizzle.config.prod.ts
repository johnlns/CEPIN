import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'libsql://cepin-johnlns.aws-us-west-2.turso.io',
    authToken: process.env.DATABASE_AUTH_TOKEN || '',
  },
})


