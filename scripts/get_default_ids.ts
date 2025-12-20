import { prisma } from "../lib/prisma";

async function getDefaultIds() {
  try {
    const roast = await prisma.roast.findFirst({
      select: { id: true },
    });

    if (!roast) {
      console.error("Error: No Roast record found.");
      process.exit(1);
    }

    const grindOption = await prisma.grindOption.findFirst({
      select: { id: true },
    });

    if (!grindOption) {
      console.error("Error: No GrindOption record found.");
      process.exit(1);
    }

    console.log(`Default Roast ID: ${roast.id}`);
    console.log(`Default GrindOption ID: ${grindOption.id}`);
  } catch (error) {
    console.error("An error occurred while fetching default IDs:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

getDefaultIds();
