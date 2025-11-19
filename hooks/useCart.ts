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
      quantity = 1
      // future: options like roastId/grindOptionId
    ): Promise<{ success: true } | { success: false; error: string }> => {
      try {
        // For stability, always operate on localStorage first
        const cart = getCartFromLocalStorage();
        const index = cart.findIndex((i: any) => i.id === productToAdd.id);

        if (index > -1) {
          cart[index].quantity = (cart[index].quantity || 0) + quantity;
        } else {
          cart.push({
            id: productToAdd.id,
            name: productToAdd.name,
            image: productToAdd.image ?? null,
            basePrice: productToAdd.basePrice,
            quantity,
          });
        }

        saveCartToLocalStorage(cart);

        // Update the hook state so consumers re-render
        setCartItems((prev) => {
          const prevIndex = prev.findIndex((i) => i.id === productToAdd.id);
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
                id: productToAdd.id,
                productId: productToAdd.id,
                name: productToAdd.name,
                image: productToAdd.image ?? null,
                basePrice: productToAdd.basePrice,
                quantity,
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
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return handleRemoveItem(itemId);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update localStorage
    const cart = getCartFromLocalStorage();
    const index = cart.findIndex((item) => item.id === itemId);
    if (index > -1) {
      cart[index].quantity = newQuantity;
      saveCartToLocalStorage(cart);
      try {
        dispatchCartUpdateEvent();
      } catch {}
    }
  };

  // --- remove ---
  const handleRemoveItem = async (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));

    const updated = getCartFromLocalStorage().filter(
      (item) => item.id !== itemId
    );
    saveCartToLocalStorage(updated);
    try {
      dispatchCartUpdateEvent();
    } catch {}
  };

  const handleUpdateItemOptions = async (
    itemId: string,
    updates: { roastId?: string; grindOptionId?: string }
  ) => {
    // currently only server would handle option prices; keep as no-op for local-first
    if (!isSignedIn) {
      console.warn(
        "Option updates require server sync; currently skipped in local-first mode."
      );
      return;
    }

    await fetch(`/api/cart/item/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    // refresh from server/local after change
    fetchCart();
  };

  const totalItems = cartItems.reduce((t, item) => t + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (t, item) => t + (item.basePrice || 0) * (item.quantity || 0),
    0
  );
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
