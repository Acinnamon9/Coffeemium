"use client";

import { deleteProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
