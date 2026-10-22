"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState, type MouseEvent } from "react";
import { fireConfetti } from "@/lib/confetti";

export default function ProductDetailActions({
  product,
  quantity,
  options,
}: {
  product: { id: string; name: string; basePrice: number; image: string };
  quantity: number;
  options: { roastId?: string | null; grindOptionId?: string | null; packageGrams: number };
}) {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);

  async function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    if (adding || loading) return;
    const button = event.currentTarget;
    setAdding(true);
    const result = await addToCart(product, quantity, options);
    setAdding(false);
    if (result.success) {
      fireConfetti(button);
      toast.success(`${product.name} added to your cart.`);
    }
    else toast.error(result.error ?? "Please sign in before adding items.");
  }

  return <Button onClick={handleAdd} disabled={adding || loading} className="w-full rounded-full bg-[#3b281e] py-6 text-lg hover:bg-[#563b2b]">{adding ? "Adding…" : `Add ${quantity} to Cart`}</Button>;
}
