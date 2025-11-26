// app/cart/cart.types.ts

// Define the structure for a cart item, matching what's expected from API and localStorage
export interface CartItem {
  id: string; // Unique identifier for the cart item itself, matching the database ID
  productId: string | number;
  name: string;
  image?: string | null;
  basePrice: number;
  quantity: number;
  roastId?: string; // Optional, for database cart
  grindOptionId?: string; // Optional, for database cart
  priceAtAddition?: number; // Optional, for database cart
}

// Minimal type for items retrieved from localStorage
export interface LocalCartItem {
  id: string;
  name: string;
  image?: string | null;
  basePrice: number;
  quantity: number;
  roastId?: string;
  grindOptionId?: string;
}

export interface Roast {
  id: string;
  name: string;
  defaultMultiplier: number | null;
}

export interface GrindOption {
  id: string;
  name: string;
  extraCost: number;
}
