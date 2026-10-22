"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { STOREFRONT_PRODUCTS_TAG } from "@/lib/products";
import { Prisma } from "@/prisma/generated/client/client";

async function requireAdmin() {
  const { userId } = await auth();
  const allowedAdminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!userId || !allowedAdminIds.includes(userId)) {
    throw new Error("Unauthorized");
  }
}

function revalidateStorefront() {
  revalidateTag(STOREFRONT_PRODUCTS_TAG, "max");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/demo");
}

function readProductDetail(formData: FormData) {
  const text = (key: string) => String(formData.get(key) ?? "").trim();
  const score = (key: string) => {
    const value = text(key);
    if (!value) return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
      throw new Error(`${key} must be a whole number from 1 to 5.`);
    }
    return parsed;
  };
  let roastProfiles: Record<string, unknown> | null = null;
  const roastProfilesText = text("roastProfiles");
  if (roastProfilesText) {
    const parsed: unknown = JSON.parse(roastProfilesText);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Roast presentation must be a JSON object keyed by roast name.");
    }
    roastProfiles = parsed as Record<string, unknown>;
  }
  return {
    origin: text("origin") || null,
    tastingNotes: text("tastingNotes").split(",").map((note) => note.trim()).filter(Boolean),
    body: score("body"),
    acidity: score("acidity"),
    sweetness: score("sweetness"),
    bitterness: score("bitterness"),
    galleryImages: text("galleryImages").split("\n").map((image) => image.trim()).filter(Boolean),
    roastProfiles: roastProfiles ? roastProfiles as Prisma.InputJsonValue : Prisma.DbNull,
  };
}

export async function addProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const image = formData.get("image") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const detail = readProductDetail(formData);

  await prisma.product.create({
    data: {
      name,
      description,
      basePrice,
      image,
      stock,
      detail: { create: { fullDescription: "", ...detail } },
    },
  });

  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const image = formData.get("image") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const detail = readProductDetail(formData);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      basePrice,
      image,
      stock,
      detail: {
        upsert: {
          create: { fullDescription: "", ...detail },
          update: detail,
        },
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${id}`);
  revalidateStorefront();
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidateStorefront();
}
