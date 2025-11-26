"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  CartItem,
  LocalCartItem,
  Roast,
  GrindOption,
} from "@/app/cart/cart.types";
import {
  getCartFromLocalStorage,
  saveCartToLocalStorage,
  clearLocalStorageCart,
} from "@/lib/localStorageCart";
import { dispatchCartUpdateEvent } from "@/lib/cartEvents";

/**
 * useCart - central hook for cart behavior (local-first)
 *
 * Notes:
 * - For now we operate local-first (works whether signed-in or not).
 * - Server merge / server CRUD can be added back later once backend endpoints are stable.
 * - The hook listens to a "cartUpdated" custom event and the window "storage" event
 *   so multiple instances and tabs stay in sync.
 */

// Helper function to match cart items by unique combination
const matchesCartItem = (
  item: any,
  productId: string | number,
  roastId?: string | null,
  grindOptionId?: string | null
) => {
  return (
    item.id === productId &&
    (item.roastId ?? null) === (roastId ?? null) &&
    (item.grindOptionId ?? null) === (grindOptionId ?? null)
  );
};

export function useCart() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [grindOptions, setGrindOptions] = useState<GrindOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- existing merge function (kept, but currently not called by fetchCart) ---
  const mergeLocalCartToServer = useCallback(async () => {
    const localCart = getCartFromLocalStorage();
    if (!localCart.length) return;

    try {
      const response = await fetch("/api/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: localCart }),
      });

      if (!response.ok) {
        throw new Error("Failed to merge guest cart into user cart");
      }

      clearLocalStorageCart();
    } catch (err) {
      console.error("Cart merge failed:", err);
      // swallow for now — we won't crash UI if merge fails
    }
  }, []);

  // --- load cart from localStorage (used for local-first approach) ---
  const fetchCart = useCallback(async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      // TEMP: local-first mode to stabilise local flow.
      const localCart: LocalCartItem[] = getCartFromLocalStorage();
      setCartItems(
        localCart.map((item) => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          image: item.image,
          basePrice: item.basePrice,
          quantity: item.quantity,
          roastId: item.roastId,
          grindOptionId: item.grindOptionId,
        }))
      );
    } catch (err: any) {
      setError(err?.message ?? "Cart load failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded]);

  const fetchOptions = useCallback(async () => {
    try {
      const response = await fetch("/api/options");
      const data = await response.json();

      setRoasts(data.roasts || []);
      setGrindOptions(data.grindOptions || []);
    } catch (err) {
      console.error("Failed to fetch options:", err);
    }
  }, []);

  // --- addToCart: local-first add; returns { success, error? } ---
  const addToCart = useCallback(
    async (
      productToAdd: {
        id: string | number;
        name: string;
        image?: string | null;
        basePrice: number;
      },
      quantity = 1,
      options?: {
        roastId?: string | null;
        grindOptionId?: string | null;
      }
    ): Promise<{ success: true } | { success: false; error: string }> => {
      try {
        // For stability, always operate on localStorage first
        const cart = getCartFromLocalStorage();

        // Match based on unique combination: productId + roastId + grindOptionId
        // This mirrors the database @@unique constraint
        const index = cart.findIndex(
          (i: any) =>
            i.id === productToAdd.id &&
            (i.roastId ?? null) === (options?.roastId ?? null) &&
            (i.grindOptionId ?? null) === (options?.grindOptionId ?? null)
        );

        if (index > -1) {
          cart[index].quantity = (cart[index].quantity || 0) + quantity;
        } else {
          cart.push({
            id: productToAdd.id,
            name: productToAdd.name,
            image: productToAdd.image ?? null,
            basePrice: productToAdd.basePrice,
            quantity,
            roastId: options?.roastId ?? null,
            grindOptionId: options?.grindOptionId ?? null,
          });
        }

        saveCartToLocalStorage(cart);

        // Update the hook state so consumers re-render
        setCartItems((prev) => {
          const prevIndex = prev.findIndex(
            (i) =>
              i.id === productToAdd.id &&
              (i.roastId ?? null) === (options?.roastId ?? null) &&
              (i.grindOptionId ?? null) === (options?.grindOptionId ?? null)
          );
          if (prevIndex > -1) {
            const copy = [...prev];
            copy[prevIndex] = {
              ...copy[prevIndex],
              quantity: (copy[prevIndex].quantity || 0) + quantity,
            };
            return copy;
          } else {
            return [
              ...prev,
              {
                id: String(productToAdd.id),
                productId: productToAdd.id,
                name: productToAdd.name,
                image: productToAdd.image ?? null,
                basePrice: productToAdd.basePrice,
                quantity,
                roastId: options?.roastId ?? undefined,
                grindOptionId: options?.grindOptionId ?? undefined,
              },
            ];
          }
        });

        // Broadcast to other hook instances / tabs
        try {
          dispatchCartUpdateEvent();
        } catch (e) {
          // ignore if dispatch helper unavailable
        }

        return { success: true };
      } catch (err: any) {
        const msg = err?.message ?? "Failed to add to cart";
        console.error("addToCart error:", err);
        return { success: false, error: msg };
      }
    },
    []
  );

  // --- change quantity ---
  // itemId format: "productId-roastId-grindId" (matches the unique key)
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return handleRemoveItem(itemId);

    // Parse the unique key to get individual IDs
    const parts = itemId.split("-");
    const productId = parts[0];
    const roastId = parts[1] === "no-roast" ? null : parts[1];
    const grindId = parts[2] === "no-grind" ? null : parts[2];

    setCartItems((prev) =>
      prev.map((item) =>
        matchesCartItem(item, productId, roastId, grindId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Update localStorage
    const cart = getCartFromLocalStorage();
    const index = cart.findIndex((item) =>
      matchesCartItem(item, productId, roastId, grindId)
    );
    if (index > -1) {
      cart[index].quantity = newQuantity;
      saveCartToLocalStorage(cart);
      try {
        dispatchCartUpdateEvent();
      } catch {}
    }
  };

  // --- remove ---
  // itemId format: "productId-roastId-grindId" (matches the unique key)
  const handleRemoveItem = async (itemId: string) => {
    // Parse the unique key to get individual IDs
    const parts = itemId.split("-");
    const productId = parts[0];
    const roastId = parts[1] === "no-roast" ? null : parts[1];
    const grindId = parts[2] === "no-grind" ? null : parts[2];

    setCartItems((prev) =>
      prev.filter((item) => !matchesCartItem(item, productId, roastId, grindId))
    );

    const updated = getCartFromLocalStorage().filter(
      (item) => !matchesCartItem(item, productId, roastId, grindId)
    );
    saveCartToLocalStorage(updated);
    try {
      dispatchCartUpdateEvent();
    } catch {}
  };

  // itemId format: "productId-roastId-grindId" (matches the unique key)
  const handleUpdateItemOptions = async (
    itemId: string,
    updates: { roastId?: string; grindOptionId?: string }
  ) => {
    // Parse the unique key to get individual IDs
    const parts = itemId.split("-");
    const productId = parts[0];
    const roastId = parts[1] === "no-roast" ? null : parts[1];
    const grindId = parts[2] === "no-grind" ? null : parts[2];

    // Update local state
    setCartItems((prev) =>
      prev.map((item) =>
        matchesCartItem(item, productId, roastId, grindId)
          ? { ...item, ...updates }
          : item
      )
    );

    // Update localStorage
    const cart = getCartFromLocalStorage();
    const index = cart.findIndex((item) =>
      matchesCartItem(item, productId, roastId, grindId)
    );
    if (index > -1) {
      if (updates.roastId !== undefined) cart[index].roastId = updates.roastId;
      if (updates.grindOptionId !== undefined)
        cart[index].grindOptionId = updates.grindOptionId;
      saveCartToLocalStorage(cart);
      try {
        dispatchCartUpdateEvent();
      } catch {}
    }

    // If signed in, also sync with server (optional/future)
    if (isSignedIn) {
      try {
        await fetch(`/api/cart/item/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } catch (e) {
        console.error("Failed to sync option update to server", e);
      }
    }
  };

  const totalItems = cartItems.reduce((t, item) => t + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((t, item) => {
    // Find selected roast and grind option
    const selectedRoast = roasts.find((r) => r.id === item.roastId);
    const selectedGrind = grindOptions.find((g) => g.id === item.grindOptionId);

    // Calculate dynamic price: (basePrice × roastMultiplier) + grindExtraCost
    const roastMultiplier = selectedRoast?.defaultMultiplier ?? 1.0;
    const grindExtraCost = selectedGrind?.extraCost ?? 0;
    const adjustedPrice =
      (item.basePrice || 0) * roastMultiplier + grindExtraCost;

    return t + adjustedPrice * (item.quantity || 0);
  }, 0);
  const formattedTotalPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice);

  const isLoggedIn = isLoaded && isSignedIn;

  // listen for other sources updating the cart (other hook instances or other tabs)
  useEffect(() => {
    const onCartUpdated = () => {
      // re-read localStorage to keep state in sync
      const localCart = getCartFromLocalStorage();
      setCartItems(
        localCart.map((item) => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          image: item.image,
          basePrice: item.basePrice,
          quantity: item.quantity,
          roastId: item.roastId,
          grindOptionId: item.grindOptionId,
        }))
      );
    };

    window.addEventListener("cartUpdated", onCartUpdated as EventListener);
    window.addEventListener("storage", onCartUpdated as EventListener);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated as EventListener);
      window.removeEventListener("storage", onCartUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    fetchCart();
    fetchOptions();
  }, [fetchCart, fetchOptions]);

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
    // newly exported API
    addToCart,
  };
}
