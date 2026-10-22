import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const STOREFRONT_PRODUCTS_TAG = "storefront-products";

export const getStorefrontProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      orderBy: { basePrice: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        basePrice: true,
        category: true,
        productRoasts: {
          select: {
            roast: {
              select: { name: true },
            },
          },
        },
      },
    }),
  ["storefront-products"],
  {
    revalidate: 60,
    tags: [STOREFRONT_PRODUCTS_TAG],
  }
);
