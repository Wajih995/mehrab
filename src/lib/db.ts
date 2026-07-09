import "server-only";

import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — prevents connection exhaustion in serverless
 * (Vercel) where modules are re-evaluated across invocations, and avoids
 * hot-reload duplicates in dev.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
