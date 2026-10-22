// Shared cart types used by the cart UI, hook, and browser storage.

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
  bundleId?: string;
  bundleName?: string;
  discountPercent?: number;
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
