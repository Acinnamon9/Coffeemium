import { prisma } from "@/lib/prisma";
import type { CartItemWithPriceRelations } from "@/lib/api/cartHelpers";

export async function getActiveFeaturedDeal(now = new Date()) {
  return prisma.featuredDeal.findFirst({
    where: { id: "primary", isActive: true, startsAt: { lte: now }, endsAt: { gt: now } },
    include: { products: { include: { product: true } } },
  });
}

export async function getFeaturedDealForHomepage() {
  return prisma.featuredDeal.findUnique({
    where: { id: "primary" },
    include: { products: { include: { product: true } } },
  });
}

export function getDealPercent(deal: { discountPercent: number; products: { productId: string }[] } | null, productId: string) {
  return deal?.products.some((product) => product.productId === productId) ? deal.discountPercent : 0;
}

export function calculateDealPrice(item: CartItemWithPriceRelations, discountPercent: number) {
  if (item.bundleId) return Number(item.priceAtAddition.toFixed(2));
  const basePrice = item.product?.basePrice ?? 0;
  const roastMultiplier = item.roast?.defaultMultiplier ?? 1;
  const grindExtra = item.grindOption?.extraCost ?? 0;
  const productPrice = basePrice * roastMultiplier;
  return Number((productPrice * (1 - discountPercent / 100) + grindExtra).toFixed(2));
}
