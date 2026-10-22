"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { userId } = await auth();
  const allowed = (process.env.ADMIN_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean);
  if (!userId || !allowed.includes(userId)) throw new Error("Unauthorized");
}

export async function saveFeaturedDeal(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const discountPercent = Number(formData.get("discountPercent"));
  const startsAt = new Date(String(formData.get("startsAt") ?? ""));
  const endsAt = new Date(String(formData.get("endsAt") ?? ""));
  const productIds = [...new Set(formData.getAll("productIds").map(String))];
  const isActive = formData.get("isActive") === "on";
  if (!title || !Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 90 ||
    Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt || productIds.length === 0) {
    throw new Error("Enter a title, valid discount and dates, and select at least one product.");
  }
  await prisma.$transaction(async (tx) => {
    await tx.featuredDeal.upsert({
      where: { id: "primary" },
      create: { id: "primary", title, description, discountPercent, startsAt, endsAt, isActive },
      update: { title, description, discountPercent, startsAt, endsAt, isActive },
    });
    await tx.featuredDealProduct.deleteMany({ where: { dealId: "primary" } });
    await tx.featuredDealProduct.createMany({ data: productIds.map((productId) => ({ dealId: "primary", productId })) });
  });
  revalidatePath("/");
  revalidatePath("/admin/deals");
  revalidatePath("/cart");
}
