"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { STOREFRONT_PRODUCTS_TAG } from "@/lib/products";

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

export async function addProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const image = formData.get("image") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;

  await prisma.product.create({
    data: {
      name,
      description,
      basePrice,
      image,
      stock,
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

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      basePrice,
      image,
      stock,
    },
  });

  revalidatePath("/admin/products");
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
