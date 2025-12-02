// ------------------------------------------------------------
// i:\test-template\app\api\cart\merge\route.ts
// ------------------------------------------------------------
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { mergeItemSchema } from "@/lib/api/cartHelpers";
import type { ZodError, ZodIssue, SafeParseReturnType } from "zod";

// Helper to turn a SafeParseReturnType into a type‑guard for the success case
function isZodSuccess<T>(
  result: SafeParseReturnType<T>
): result is { success: true; data: T } {
  return result.success;
}

// -----------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return errorJson("User not authenticated", 401);

    const body = await req.json();
    const rawItems = Array.isArray(body.items) ? body.items : [];

    // -------------------------------------------------------------
    // Validate / normalize guest cart items (soft validation)
    // -------------------------------------------------------------
    const items = rawItems
      // Explicitly type the result of safeParse
      .map(
        (
          item
        ): ZodResult<{
          id: string;
          quantity: number;
          basePrice?: number;
        }> => mergeItemSchema.safeParse(item)
      )
      // Narrow to the successful parses
      .filter(isZodSuccess)
      // Extract the validated data
      .map((r) => r.data);

    if (!items.length)
      return NextResponse.json(
        { message: "Nothing to merge" },
        { status: 200 }
      );

    // -------------------------------------------------------------
    // Merge inside a typed transaction
    // -------------------------------------------------------------
    await prisma.$transaction(async (tx: PrismaClient) => {
      let cart = await tx.cart.findUnique({ where: { userId } });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      for (const item of items) {
        const existing = await tx.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: item.id,
          },
        });

        if (existing) {
          await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.id,
              quantity: item.quantity,
              priceAtAddition: item.basePrice ?? 0,
            },
          });
        }
      }
    });

    return NextResponse.json(
      { message: "Cart merged successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/cart/merge error:", err);
    return errorJson(err?.message ?? "Failed to merge cart", 500);
  }
}

// -----------------------------------------------------------------
function errorJson(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
