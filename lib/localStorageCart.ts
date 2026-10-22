import type { CartItem } from "@/app/cart/cart.types";

const CART_STORAGE_KEY = "cart";

export function getCartFromLocalStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const cart: unknown = storedCart ? JSON.parse(storedCart) : [];
    if (!Array.isArray(cart)) return [];

    return cart.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        (typeof item.productId === "string" || typeof item.productId === "number") &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
    );
  } catch (error) {
    console.error("Error getting cart from localStorage:", error);
    return [];
  }
}

function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export function saveCartToLocalStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    notifyCartUpdated();
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
    throw error;
  }
}

export function clearCartFromLocalStorage() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(CART_STORAGE_KEY);
  notifyCartUpdated();
}

export const getCartItemCount = () =>
  getCartFromLocalStorage().reduce((total, item) => total + item.quantity, 0);
