"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
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
  revalidatePath("/shop");
}

export async function updateProduct(id: string, formData: FormData) {
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
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
