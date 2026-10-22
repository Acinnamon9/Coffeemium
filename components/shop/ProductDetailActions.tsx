"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState } from "react";

export default function ProductDetailActions({
  product,
}: {
  product: { id: string; name: string; basePrice: number; image: string };
}) {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (adding || loading) return;
    setAdding(true);
    const result = await addToCart(product);
    setAdding(false);
    if (result.success) toast.success(`${product.name} added to your cart.`);
    else toast.error(result.error ?? "Please sign in before adding items.");
  }

  return <Button onClick={handleAdd} disabled={adding || loading} className="mt-8 w-full rounded-full bg-[#3b281e] py-6 text-lg hover:bg-[#563b2b] sm:w-fit sm:px-10">{adding ? "Adding…" : "Add to Cart"}</Button>;
}
