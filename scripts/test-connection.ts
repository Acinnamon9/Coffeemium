
import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  try {
    console.log("Database URL present:", !!process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
        console.log("Database URL protocol:", process.env.DATABASE_URL.split("://")[0]);
    }
    const count = await prisma.product.count();
    console.log("Product count:", count);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
