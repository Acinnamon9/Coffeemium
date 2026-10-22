import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bundles = [
    { name: "The Morning Ritual Box", slug: "morning-ritual-box", description: "Three bright, balanced coffees for a better start to the day.", image: "/images/Coffee-beans-hero-background.jpeg", bundlePrice: 1199, products: ["Ethiopian Yirgacheffe (250g)", "Kenyan AA (250g)", "Colombian Supremo (250g)"] },
    { name: "The Home Barista Trio", slug: "home-barista-trio", description: "A versatile trio for espresso, pour over, and slow mornings.", image: "/images/how-it-works/Brew.211Z.png", bundlePrice: 1299, products: ["House Espresso Blend (250g)", "Pour Over Grind (250g)", "French Press Grind (250g)"] },
  ];
  for (const data of bundles) {
    const { products: productNames, ...bundleData } = data;
    const products = await prisma.product.findMany({ where: { name: { in: productNames } }, select: { id: true, name: true } });
    if (products.length !== productNames.length) throw new Error(`Missing products for ${data.name}`);
    const bundle = await prisma.bundle.upsert({ where: { slug: data.slug }, update: bundleData, create: bundleData });
    await prisma.bundleItem.deleteMany({ where: { bundleId: bundle.id } });
    await prisma.bundleItem.createMany({ data: products.map((product) => ({ bundleId: bundle.id, productId: product.id })) });
  }
}

main().finally(() => prisma.$disconnect());
