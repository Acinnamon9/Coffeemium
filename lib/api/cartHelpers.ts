// /lib/api/cartHelpers.ts
import { Prisma } from "@/app/generated/prisma/client";
import { z } from "zod";

export type CartItemWithPriceRelations = Prisma.CartItemGetPayload<{
  include: {
    product: true;
    roast: true;
    grindOption: true;
    bundle: true;
  };
}> & {
  finalPrice?: number;
};

export function calculateItemPrice(item: CartItemWithPriceRelations): number {
  if (item.bundleId && item.priceAtAddition != null) {
    return parseFloat(item.priceAtAddition.toFixed(2));
  }
  const base = item.product?.basePrice ?? 0;
  const roastMultiplier = item.roast?.defaultMultiplier ?? 1;
  const grindExtra = item.grindOption?.extraCost ?? 0;
  return parseFloat((base * roastMultiplier + grindExtra).toFixed(2));
}

export const addItemSchema = z.object({
  productId: z.string().uuid(),
  roastId: z.string().uuid().optional().nullable(),
  grindOptionId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive().default(1),
});

export const updateItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  roastId: z.string().uuid().optional().nullable(),
  grindOptionId: z.string().uuid().optional().nullable(),
});

