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
    detail?: {
      origin: string | null;
      tastingNotes: string[];
      body: number | null;
      acidity: number | null;
      sweetness: number | null;
      bitterness: number | null;
      galleryImages: string[];
      roastProfiles: unknown;
    } | null;
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

      <fieldset className="space-y-3 rounded-lg border p-4">
        <legend className="px-1 font-medium">Coffee details</legend>
        <div className="grid gap-2">
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" name="origin" defaultValue={product?.detail?.origin ?? ""} placeholder="e.g. Colombia" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tastingNotes">Tasting notes (comma separated)</Label>
          <Input id="tastingNotes" name="tastingNotes" defaultValue={product?.detail?.tastingNotes.join(", ") ?? ""} placeholder="Caramel, cherry, walnut" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(["body", "acidity", "sweetness", "bitterness"] as const).map((field) => (
            <div className="grid gap-2" key={field}>
              <Label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)} (1–5)</Label>
              <Input id={field} name={field} type="number" min="1" max="5" step="1" defaultValue={product?.detail?.[field] ?? ""} />
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="galleryImages">Gallery image paths (one per line)</Label>
          <textarea id="galleryImages" name="galleryImages" rows={4} defaultValue={product?.detail?.galleryImages.join("\n") ?? ""} placeholder="/images/product-gallery/coffee-bag-still-life.png" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          <p className="text-xs text-gray-500">Use local image paths or public image URLs. Empty uses the shared coffee gallery.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="roastProfiles">Roast presentation (optional JSON)</Label>
          <textarea id="roastProfiles" name="roastProfiles" rows={5} defaultValue={product?.detail?.roastProfiles ? JSON.stringify(product.detail.roastProfiles, null, 2) : ""} placeholder={'{\n  "Medium": { "tastingNotes": ["Caramel"], "recommendedBrew": "Pour Over", "image": "/images/medium.jpg" }\n}'} className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs" />
        </div>
      </fieldset>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
}
