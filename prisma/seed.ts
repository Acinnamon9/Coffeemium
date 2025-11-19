import { PrismaClient } from "../app/generated/prisma/client"; // Adjust import path to where Prisma Client is actually generated
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding the database...");

  const productsData = [
    {
      name: "Coorg Arabica (250g)",
      basePrice: 480,
      description: "Single-Origin Beans from Coorg",
      image: "/images/coorg-arabica.946Z.png",
    },
    {
      name: "Chikmagalur Peaberry (250g)",
      basePrice: 520,
      description: "Single-Origin Peaberry from Chikmagalur",
      image: "/images/chikmangalur-peaberry.913Z.png",
    },
    {
      name: "Araku Valley Organic (250g)",
      basePrice: 550,
      description: "Organic Single-Origin from Araku Valley",
      image: "/images/araku-valley.244Z.png",
    },
    {
      name: "Yercaud Estate Roast (250g)",
      basePrice: 490,
      description: "Estate Roast from Yercaud",
      image: "/images/yercaud-estate.524Z.png",
    },
    {
      name: "Wayanad Robusta (250g)",
      basePrice: 430,
      description: "Robusta beans from Wayanad",
      image: "/images/wayanad-robusta.135Z.png",
    },
    {
      name: "House Espresso Blend (250g)",
      basePrice: 500,
      description: "Our signature espresso blend",
      image: "/images/house-espresso.360Z.png",
    },
    {
      name: "Morning Kick Light Roast (250g)",
      basePrice: 470,
      description: "A light roast to start your day",
      image: "/images/morning-kick.040Z.png",
    },
    {
      name: "Bold South Indian Filter Blend (250g)",
      basePrice: 450,
      description: "Traditional South Indian filter coffee blend",
      image: "/images/south-indian-filter.235Z.png",
    },
    {
      name: "Balanced Medium Roast (250g)",
      basePrice: 490,
      description: "A perfectly balanced medium roast",
      image: "/images/balanced-medium.879Z.png",
    },
    {
      name: "Cold Brew Blend (250g)",
      basePrice: 520,
      description: "Blend optimized for cold brew",
      image: "/images/cold-brew.856Z.png",
    },
    {
      name: "Premium Freeze-Dried Instant (100g)",
      basePrice: 340,
      description: "High-quality freeze-dried instant coffee",
      image: "/images/freeze-dried-instant.573Z.png",
    },
    {
      name: "100% Arabica Instant (100g)",
      basePrice: 380,
      description: "Pure Arabica instant coffee",
      image: "/images/arabica-instant.512Z.png",
    },
    {
      name: "Café Mocha Instant (100g)",
      basePrice: 360,
      description: "Instant coffee with a mocha flavor",
      image: "/images/cafe-mocha-instant.989Z.png",
    },
    {
      name: "Vanilla Infused Instant (100g)",
      basePrice: 370,
      description: "Vanilla flavored instant coffee",
      image: "/images/vanilla-instant.603Z.png",
    },
    {
      name: "Hazelnut Instant (100g)",
      basePrice: 380,
      description: "Hazelnut flavored instant coffee",
      image: "/images/hazelnut-instant.028Z.png",
    },
    {
      name: "Cinnamon Latte Roast (250g)",
      basePrice: 520,
      description: "Cinnamon flavored whole beans",
      image: "/images/cinnamon-latte.697Z.png",
    },
    {
      name: "Caramel Drizzle Beans (250g)",
      basePrice: 550,
      description: "Caramel flavored whole beans",
      image: "/images/caramel-drizzle.116Z.png",
    },
    {
      name: "Chocolate Infused Dark Roast (250g)",
      basePrice: 580,
      description: "Dark roast infused with chocolate",
      image: "/images/chocolate-infused.467Z.png",
    },
    {
      name: "Irish Cream Roast (250g)",
      basePrice: 590,
      description: "Irish Cream flavored whole beans",
      image: "/images/irish-cream.446Z.png",
    },
    {
      name: "Coconut Mocha Roast (250g)",
      basePrice: 560,
      description: "Coconut mocha flavored whole beans",
      image: "/images/coconut-mocha.119Z.png",
    },
    {
      name: "Monsoon Malabar (250g)",
      basePrice: 650,
      description: "Specialty Monsoon Malabar coffee",
      image: "/images/monsoon-malabar.137Z.png",
    },
    {
      name: "Blue Tokai Micro Lot (250g)",
      basePrice: 700,
      description: "Premium Micro Lot from Blue Tokai",
      image: "/images/blue-tokai.236Z.png",
    },
    {
      name: "Ethiopian Yirgacheffe (250g)",
      basePrice: 750,
      description: "Exquisite Ethiopian Yirgacheffe",
      image: "/images/ethiopian-yirgacheffe.357Z.png",
    },
    {
      name: "Colombian Supremo (250g)",
      basePrice: 720,
      description: "Finest Colombian Supremo",
      image: "/images/colombian-supremo.512Z.png",
    },
    {
      name: "Kenyan AA (250g)",
      basePrice: 740,
      description: "Top-grade Kenyan AA coffee",
      image: "/images/kenyan-aa.421Z.png",
    },
    {
      name: "Moka Pot Grind (250g)",
      basePrice: 480,
      description: "Ground specifically for Moka Pot",
      image: "/images/moka-pot-grind.955Z.png",
    },
    {
      name: "French Press Grind (250g)",
      basePrice: 500,
      description: "Ground specifically for French Press",
      image: "/images/french-press-grind.172Z.png",
    },
    {
      name: "AeroPress Grind (250g)",
      basePrice: 520,
      description: "Ground specifically for AeroPress",
      image: "/images/aeropress-grind.435Z.png",
    },
    {
      name: "Pour Over Grind (250g)",
      basePrice: 510,
      description: "Ground specifically for Pour Over",
      image: "/images/pour-over-grind.453Z.png",
    },
    {
      name: "Espresso Machine Grind (250g)",
      basePrice: 530,
      description: "Ground specifically for Espresso Machines",
      image: "/images/espresso-machine-grind.624Z.png",
    },
  ];

  const createdProducts = [];
  for (const productData of productsData) {
    const product = await prisma.product.create({ data: productData });
    createdProducts.push(product);
    console.log(`Created product: ${product.name}`);
  }

  const roastOptions = [
    {
      name: "Light",
      roastLevel: 1,
      defaultMultiplier: 1.0,
      roastMultiplier: 1.0,
    },
    {
      name: "Medium",
      roastLevel: 2,
      defaultMultiplier: 1.05,
      roastMultiplier: 1.05,
    },
    {
      name: "Dark",
      roastLevel: 3,
      defaultMultiplier: 1.1,
      roastMultiplier: 1.1,
    },
  ];

  // Create canonical roast types once
  const createdRoasts: any[] = [];
  for (const r of roastOptions) {
    const roast = await prisma.roast.create({
      data: {
        name: r.name,
        roastLevel: r.roastLevel,
        defaultMultiplier: r.defaultMultiplier,
      },
    });
    createdRoasts.push(roast);
    console.log(`Created roast type: ${roast.name}`);
  }

  // Link each product to the canonical roast types via the junction table
  for (const product of createdProducts) {
    for (const roastOption of roastOptions) {
      const roast = createdRoasts.find(
        (x) =>
          x.name === roastOption.name && x.roastLevel === roastOption.roastLevel
      );
      if (!roast) continue;

      await prisma.productRoast.create({
        data: {
          productId: product.id,
          roastId: roast.id,
          roastMultiplier: roastOption.roastMultiplier ?? null,
        },
      });
      console.log(`Linked ${product.name} -> ${roast.name}`);
    }
  }

  const grindOptions = [
    { name: "Whole Beans", extraCost: 0 },
    { name: "French Press", extraCost: 30 },
    { name: "Pour Over", extraCost: 40 },
    { name: "Espresso", extraCost: 50 },
  ];

  for (const grindOption of grindOptions) {
    const id = randomUUID();
    // Use parameterized raw SQL to avoid depending on generated client types for GrindOption
    await prisma.$executeRaw`
      INSERT INTO "GrindOption" ("id", "name", "extraCost") VALUES (${id}, ${grindOption.name}, ${grindOption.extraCost})
    `;
    console.log(`Created grind option: ${grindOption.name}`);
  }

  console.log("Database seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
