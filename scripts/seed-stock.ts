import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding stock...");

  const products = await prisma.product.findMany();

  // Pick 3 random indices to have 0 stock
  const zeroStockIndices = new Set<number>();
  while (zeroStockIndices.size < 3 && zeroStockIndices.size < products.length) {
    const randomIndex = Math.floor(Math.random() * products.length);
    zeroStockIndices.add(randomIndex);
  }

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const stock = zeroStockIndices.has(i) ? 0 : 100;

    await prisma.product.update({
      where: { id: product.id },
      data: { stock },
    });
    console.log(`Updated product ${product.name} stock to ${stock}`);
  }

  console.log("Stock seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
