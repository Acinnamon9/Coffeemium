import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getBasePackageGrams } from "@/lib/package-size";

const pairingSchema = z.object({
  productIds: z.array(z.string().uuid()).length(2).refine((ids) => ids[0] !== ids[1]),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const parsed = pairingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Choose two different coffees" }, { status: 400 });

    const [firstId, secondId] = [...parsed.data.productIds].sort();
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } });
      const products = await tx.product.findMany({
        where: { id: { in: [firstId, secondId] } },
        select: { id: true, name: true, image: true, basePrice: true },
      });
      if (products.length !== 2) throw new Error("Pairing products not found");

      const regularTotal = products.reduce((sum, product) => sum + product.basePrice, 0);
      const slug = `demo-pairing-${firstId}-${secondId}`;
      const bundle = await tx.bundle.upsert({
        where: { slug },
        update: {
          name: "Coffeemium Coffee Pairing (Demo)",
          description: "A curated two-coffee pairing with a demo 10% bundle saving.",
          image: products[0].image,
          bundlePrice: Number((regularTotal * 0.9).toFixed(2)),
        },
        create: {
          name: "Coffeemium Coffee Pairing (Demo)",
          slug,
          description: "A curated two-coffee pairing with a demo 10% bundle saving.",
          image: products[0].image,
          bundlePrice: Number((regularTotal * 0.9).toFixed(2)),
        },
      });
      await tx.bundleItem.deleteMany({ where: { bundleId: bundle.id } });
      await tx.bundleItem.createMany({ data: products.map((product) => ({ bundleId: bundle.id, productId: product.id })) });

      const cart = await tx.cart.upsert({ where: { userId }, update: {}, create: { userId } });
      for (const product of products) {
        const packageGrams = getBasePackageGrams(product.name);
        const discountedUnitPrice = Number((product.basePrice * 0.9).toFixed(2));
        const existing = await tx.cartItem.findFirst({
          where: { cartId: cart.id, productId: product.id, bundleId: bundle.id, roastId: null, grindOptionId: null, packageGrams },
        });
        if (existing) {
          await tx.cartItem.update({ where: { id: existing.id }, data: { quantity: { increment: 1 } } });
        } else {
          await tx.cartItem.create({
            data: { cartId: cart.id, productId: product.id, bundleId: bundle.id, quantity: 1, packageGrams, priceAtAddition: discountedUnitPrice },
          });
        }
      }
      return { bundleId: bundle.id };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add pairing";
    const status = message === "Pairing products not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
