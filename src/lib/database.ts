import prisma from '@prisma/client'

// Prisma doesn't support ESM
export const db = new prisma.PrismaClient()
