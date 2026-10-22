// /app/api/cart/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  addItemSchema,
  CartItemWithPriceRelations,
  validatePackageSize,
} from "@/lib/api/cartHelpers";
import { calculateDealPrice, getActiveFeaturedDeal, getDealPercent } from "@/lib/deals";
import { getBasePackageGrams } from "@/lib/package-size";

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
      // Ensure the user exists to satisfy foreign key constraints
      await tx.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId },
      });

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

      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { basePrice: true, name: true },
      });
      if (!product) throw new Error("Product not found");
      const packageGrams = parsed.data.packageGrams ?? getBasePackageGrams(product.name);
      if (!validatePackageSize(product.name, packageGrams)) throw new Error("Invalid package size");

      // Find if identical item exists (same product + same options)
      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          roastId: roastId ?? null,
          grindOptionId: grindOptionId ?? null,
          packageGrams,
          bundleId: null,
        },
      });

      if (existing) {
        // increment quantity
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: quantity } },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            packageGrams,
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
          items: { include: { product: true, roast: true, grindOption: true, bundle: true } },
        },
      });
    });

    const deal = await getActiveFeaturedDeal();
    const itemsWithPrice = (result?.items || []).map((i) => ({
      ...i,
      discountPercent: getDealPercent(deal, i.productId),
      finalPrice: calculateDealPrice(i as CartItemWithPriceRelations, getDealPercent(deal, i.productId)),
    }));

    return NextResponse.json(
      { cart: { ...result!, items: itemsWithPrice } },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("POST /api/cart error:", err);
    if (err instanceof Error && err.message === "Product not found") {
      return errorJson(err.message, 404);
    }
    if (err instanceof Error && err.message === "Invalid package size") {
      return errorJson(err.message, 400);
    }
    return errorJson(err instanceof Error ? err.message : "Unexpected error", 500);
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
        items: { include: { product: true, roast: true, grindOption: true, bundle: true } },
      },
    });

    if (!cart)
      return NextResponse.json(
        { cart: { id: null, userId, items: [] } },
        { status: 200 }
      );

    const deal = await getActiveFeaturedDeal();
    const itemsWithPrice = cart.items.map((i) => ({
      ...i,
      discountPercent: getDealPercent(deal, i.productId),
      finalPrice: calculateDealPrice(i as CartItemWithPriceRelations, getDealPercent(deal, i.productId)),
    }));

    return NextResponse.json(
      { cart: { ...cart, items: itemsWithPrice } },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("GET /api/cart error:", err);
    return errorJson(err instanceof Error ? err.message : "Unexpected error", 500);
  }
}
