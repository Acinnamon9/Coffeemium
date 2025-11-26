import { PrismaClient } from "@/app/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    errorFormat: "minimal",
  }).$extends(withAccelerate());
};

const globalForPrisma = globalThis as unknown as {
  prismaApp: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prisma = globalForPrisma.prismaApp ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaApp = prisma;

export { prisma };
