// /app/api/cart/item/[itemId]/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  updateItemSchema,
  CartItemWithPriceRelations,
  calculateItemPrice,
} from "@/lib/api/cartHelpers";

function errorJson(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

// PATCH /api/cart/item/[itemId] -> update quantity/options
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await context.params;
    if (!itemId) return errorJson("Missing cart item ID", 400);

    const { userId } = await auth();
    if (!userId) return errorJson("User not authenticated", 401);

    const body = await req.json();
    const parsed = updateItemSchema.safeParse(body);
    if (!parsed.success) return errorJson(parsed.error.message, 400);

    const updateData = parsed.data;
    // optional: if updating qty to zero, remove instead
    if (updateData.quantity !== undefined && updateData.quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return NextResponse.json({ message: "Item removed" }, { status: 200 });
    }

    // Verify ownership
    const found = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: { select: { userId: true } } },
    });
    if (!found) return errorJson("Cart item not found", 404);
    if (found.cart.userId !== userId) return errorJson("Forbidden", 403);

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: updateData,
      include: { product: true, roast: true, grindOption: true },
    });

    return NextResponse.json({
      item: {
        ...updated,
        finalPrice: calculateItemPrice(updated as CartItemWithPriceRelations),
      },
    });
  } catch (err: any) {
    console.error("PATCH /api/cart/item error:", err);
    return errorJson(err?.message ?? "Unexpected error", 500);
  }
}

// DELETE /api/cart/item/[itemId] -> remove item
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await context.params;
    if (!itemId) return errorJson("Missing cart item ID", 400);

    const { userId } = await auth();
    if (!userId) return errorJson("User not authenticated", 401);

    const found = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: { select: { userId: true } } },
    });
    if (!found) return errorJson("Cart item not found", 404);
    if (found.cart.userId !== userId) return errorJson("Forbidden", 403);

    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ message: "Item deleted" }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/cart/item error:", err);
    return errorJson(err?.message ?? "Unexpected error", 500);
  }
}
