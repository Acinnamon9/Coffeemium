import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../app/generated/prisma/client";
import { productDetails } from "../prisma/product-details";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  for (const item of productDetails) {
    const product = await prisma.product.findFirst({
      where: { name: item.productName },
    });

    if (!product) {
      console.warn(`❌ Product not found: ${item.productName}`);
      continue;
    }

    await prisma.productDetail.upsert({
      where: { productId: product.id },
      update: {
        fullDescription: item.fullDescription,
      },
      create: {
        productId: product.id,
        fullDescription: item.fullDescription,
      },
    });

    // Log to console
    console.log(`✅ Added detail for ${item.productName}`);
    // Append log entry to a file for persistent record
    const logEntry = `${new Date().toISOString()} - Uploaded detail for ${item.productName}\n`;
    fs.appendFileSync("backfill_log.txt", logEntry);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
