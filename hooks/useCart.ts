"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { CartItem, Roast, GrindOption } from "@/app/cart/cart.types";

export function useCart() {
  const { isLoaded, isSignedIn } = useUser();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [grindOptions, setGrindOptions] = useState<GrindOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCartItems(
        (data.cart?.items || []).map((i: any) => ({
          id: i.id,
          quantity: i.quantity,
          basePrice: i.product?.basePrice ?? 0,
          name: i.product?.name ?? "Unknown",
          image: i.product?.image ?? null,
          roastId: i.roastId ?? null,
          grindOptionId: i.grindOptionId ?? null,
        }))
      );
    } catch (err: any) {
      setError(err.message ?? "Cart load failed");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const fetchOptions = useCallback(async () => {
    try {
      const res = await fetch("/api/options");
      const data = await res.json();
      setRoasts(data.roasts || []);
      setGrindOptions(data.grindOptions || []);
      const defaultRoast = data.roasts?.[0]?.id ?? null;
      const defaultGrind = data.grindOptions?.[0]?.id ?? null;
    } catch (err) {
      console.error("Failed to load options", err);
    }
  }, []);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (!isSignedIn) return;
    if (quantity <= 0) return handleRemoveItem(itemId);

    await fetch(`/api/cart/item/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    await fetchCart();
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!isSignedIn) return;

    await fetch(`/api/cart/item/${itemId}`, {
      method: "DELETE",
    });

    await fetchCart();
  };

  const handleUpdateItemOptions = async (
    itemId: string,
    updates: { roastId?: string; grindOptionId?: string }
  ) => {
    if (!isSignedIn) return;

    await fetch(`/api/cart/item/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    await fetchCart();
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((t, item) => {
    const roast = roasts.find((r) => r.id === item.roastId);
    const grind = grindOptions.find((g) => g.id === item.grindOptionId);
    const roastMultiplier = roast?.defaultMultiplier ?? 1;
    const grindCost = grind?.extraCost ?? 0;
    return t + (item.basePrice * roastMultiplier + grindCost) * item.quantity;
  }, 0);

  const formattedTotalPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice);

  const isLoggedIn = isLoaded && isSignedIn;

  useEffect(() => {
    fetchOptions();
    fetchCart();
  }, [fetchOptions, fetchCart]);
  const addToCart = async (
    product: { id: string; name: string; basePrice: number; image?: string },
    quantity = 1,
    options?: { roastId?: string | null; grindOptionId?: string | null }
  ) => {
    if (!isSignedIn) {
      return { success: false, error: "User not signed in" };
    }

    const defaultRoast = roasts[0]?.id ?? null;
    const defaultGrind = grindOptions[0]?.id ?? null;

    const body = {
      productId: product.id,
      quantity,
      roastId: options?.roastId ?? defaultRoast,
      grindOptionId: options?.grindOptionId ?? defaultGrind,
    };

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.error ?? "Failed to add to cart" };
      }

      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error("addToCart failed:", err);
      return { success: false, error: "Unexpected error" };
    }
  };

  return {
    cartItems,
    roasts,
    grindOptions,
    loading,
    error,
    isLoggedIn,
    totalItems,
    formattedTotalPrice,
    handleQuantityChange,
    handleRemoveItem,
    handleUpdateItemOptions,
    addToCart,
  };
}
