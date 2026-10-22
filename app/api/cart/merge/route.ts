import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      roastId: z.string().uuid().optional().nullable(),
      grindOptionId: z.string().uuid().optional().nullable(),
      quantity: z.number().int().positive(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const parsed = mergeCartSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } });
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      for (const item of parsed.data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { basePrice: true },
        });
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const existing = await tx.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: item.productId,
            roastId: item.roastId ?? null,
            grindOptionId: item.grindOptionId ?? null,
            bundleId: null,
          },
        });

        if (existing) {
          await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              roastId: item.roastId ?? null,
              grindOptionId: item.grindOptionId ?? null,
              quantity: item.quantity,
              priceAtAddition: product.basePrice,
            },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/cart/merge error:", error);
    if (error instanceof Error && error.message.startsWith("Product not found:")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to merge cart" }, { status: 500 });
  }
}
