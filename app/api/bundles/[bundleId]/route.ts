import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ bundleId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    const { bundleId } = await params;

    await prisma.$transaction(async (tx) => {
      const bundle = await tx.bundle.findUnique({ where: { id: bundleId }, include: { items: { include: { product: true } } } });
      if (!bundle || bundle.items.length === 0) throw new Error("Bundle not found");

      const cart = await tx.cart.upsert({ where: { userId }, update: {}, create: { userId } });
      const regularTotal = bundle.items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);

      for (const item of bundle.items) {
        const discountedUnitPrice = (bundle.bundlePrice * (item.product.basePrice / regularTotal));
        const existing = await tx.cartItem.findFirst({ where: { cartId: cart.id, productId: item.productId, bundleId: bundle.id, roastId: null, grindOptionId: null } });
        if (existing) {
          await tx.cartItem.update({ where: { id: existing.id }, data: { quantity: { increment: item.quantity } } });
        } else {
          await tx.cartItem.create({ data: { cartId: cart.id, productId: item.productId, bundleId: bundle.id, quantity: item.quantity, priceAtAddition: discountedUnitPrice } });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add bundle";
    return NextResponse.json({ error: message }, { status: message === "Bundle not found" ? 404 : 500 });
  }
}
