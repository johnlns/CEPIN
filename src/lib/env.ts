import { z } from 'zod'

const envSchema = z.object({
  // Em DEV, aceitamos qualquer string; default local para libsql (file:)
  DATABASE_URL: z.string().default('file:dev.db'),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  // SMTP opcional para modo DEV: vazio cai no log simulado no mailer
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().email().or(z.literal('')).default(''),
  SMTP_PASS: z.string().optional().default(''),
  APP_URL: z.string().url().default('http://localhost:3000'),
  // Em DEV, fornecemos um segredo padrão longo suficiente
  NEXTAUTH_SECRET: z.string().min(32).default('dev-secret-dev-secret-dev-secret-dev-secret-123456'),
})

export const env = envSchema.parse(process.env)
