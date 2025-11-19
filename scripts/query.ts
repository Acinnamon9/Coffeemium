import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      productRoasts: true,
      detail: true,
    },
  });
  console.log(products);
}

main().finally(() => prisma.$disconnect());
