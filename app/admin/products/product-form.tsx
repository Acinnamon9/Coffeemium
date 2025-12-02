"use client";

import { addProduct, updateProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    image: string;
    stock: number;
  };
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        // If it was a separate page, we'd redirect.
        // But if it's inline, we might just clear the form.
        // For now, let's assume it refreshes.
      }
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 border p-4 rounded-lg bg-white shadow-sm"
    >
      <h3 className="text-lg font-medium">
        {product ? "Edit Product" : "Add New Product"}
      </h3>

      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={product?.description}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="basePrice">Price</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            step="0.01"
            defaultValue={product?.basePrice}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock ?? 0}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" defaultValue={product?.image} required />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
}
