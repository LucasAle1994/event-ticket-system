import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  try {
    console.log(
      "[PRISMA DEBUG] DB:",
      databaseUrl.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@"),
    );
  } catch (e) {
    // ignore logging errors
  }
} else {
  // During build (or in environments without a DB configured at build-time)
  // we must not throw here because Next.js build may run without runtime env vars.
  // Defer error to runtime when the DB is actually needed.
  console.warn("[PRISMA DEBUG] DATABASE_URL not defined at build-time. Prisma client will be created without adapter; runtime DB access will fail until DATABASE_URL is provided.");
}

const adapter = databaseUrl ? new PrismaPg({ connectionString: databaseUrl }) : (null as any);

export const prisma = globalForPrisma.prisma ?? (databaseUrl ? new PrismaClient({ adapter }) : new PrismaClient({} as any));

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
