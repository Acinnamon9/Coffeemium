// /app/api/cart/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  addItemSchema,
  CartItemWithPriceRelations,
  calculateItemPrice,
} from "@/lib/api/cartHelpers";

function errorJson(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

// POST /api/cart  -> add item (or increment existing)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return errorJson("User not authenticated", 401);

    const body = await req.json();
    const parsed = addItemSchema.safeParse(body);
    if (!parsed.success) return errorJson(parsed.error.message, 400);

    const { productId, roastId, grindOptionId, quantity } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      // Ensure cart exists
      let cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
          include: { items: true },
        });
      }

      // Find if identical item exists (same product + same options)
      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          roastId: roastId ?? null,
          grindOptionId: grindOptionId ?? null,
        },
      });

      if (existing) {
        // increment quantity
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: quantity } },
        });
      } else {
        // ensure product exists and capture priceAtAddition
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { basePrice: true },
        });
        if (!product) throw new Error("Product not found");

        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            priceAtAddition: product.basePrice,
            ...(roastId ? { roastId } : {}),
            ...(grindOptionId ? { grindOptionId } : {}),
          },
        });
      }

      // return fresh cart with relations
      return tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true, roast: true, grindOption: true },
          },
        },
      });
    });

    const itemsWithPrice = (result!.items || []).map((i: any) => ({
      ...i,
      finalPrice: calculateItemPrice(i as CartItemWithPriceRelations),
    }));

    return NextResponse.json(
      { cart: { ...result!, items: itemsWithPrice } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/cart error:", err);
    if (err instanceof Error && err.message === "Product not found") {
      return errorJson(err.message, 404);
    }
    return errorJson(err?.message ?? "Unexpected error", 500);
  }
}

// GET /api/cart -> fetch logged-in user's cart
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return errorJson("User not authenticated", 401);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true, roast: true, grindOption: true },
        },
      },
    });

    if (!cart)
      return NextResponse.json(
        { cart: { id: null, userId, items: [] } },
        { status: 200 }
      );

    const itemsWithPrice = cart.items.map((i: any) => ({
      ...i,
      finalPrice: calculateItemPrice(i as CartItemWithPriceRelations),
    }));

    return NextResponse.json(
      { cart: { ...cart, items: itemsWithPrice } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/cart error:", err);
    return errorJson(err?.message ?? "Unexpected error", 500);
  }
}
