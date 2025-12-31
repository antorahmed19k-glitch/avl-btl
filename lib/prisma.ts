
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://neondb_owner:npg_zh2xeTCqDjy8@ep-fancy-voice-ah2sqhz8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
      }
    },
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
