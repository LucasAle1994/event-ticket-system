import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;
console.log(
  "[PRISMA DEBUG] DB:",
  databaseUrl?.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@"),
);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined. Configure the PostgreSQL connection in the environment.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
