import { drizzle } from 'drizzle-orm/libsql'
import { db } from './client'
import * as schema from './schema'

export const drizzleDb = drizzle(db, { schema })
