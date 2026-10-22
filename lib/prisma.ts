import { PrismaClient } from "@/prisma/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    errorFormat: "minimal",
  });
};

const globalForPrisma = globalThis as unknown as {
  prismaApp: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prisma = globalForPrisma.prismaApp ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaApp = prisma;

export { prisma };
