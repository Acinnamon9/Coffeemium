import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getCuratedBundles = unstable_cache(
  async () => prisma.bundle.findMany({ orderBy: { createdAt: "asc" }, include: { items: { include: { product: true } } } }),
  ["curated-bundles"],
  { revalidate: 60, tags: ["curated-bundles"] }
);
