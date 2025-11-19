"use client";
import Image from "next/image";

import { CartItem, Roast, GrindOption } from "../../app/cart/cart.types";

export interface CartItemDisplayProps {
  item: CartItem;
  isLoggedIn: boolean;
  roasts: Roast[];
  grindOptions: GrindOption[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItemOptions: (
    itemId: string,
    updates: { roastId?: string | null; grindOptionId?: string | null }
  ) => Promise<void>;
}

// Placeholder for a single cart item display
export const CartItemDisplay = ({
  item,
  isLoggedIn,
  roasts,
  grindOptions,
  onQuantityChange,
  onRemoveItem,
  onUpdateItemOptions,
}: CartItemDisplayProps) => {
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(item.basePrice * item.quantity);

  const handleQuantityIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    } else {
      // If quantity is 1, removing it should prompt confirmation or directly remove
      onRemoveItem(item.id);
    }
  };

  const handleRemove = () => {
    // Optional: Add a confirmation dialog here
    onRemoveItem(item.id);
  };

  return (
    <div className="flex items-center justify-between border-b py-4 last:border-b-0">
      <div className="flex items-center gap-4">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {(item.basePrice ?? 0).toFixed(2)} each
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={handleQuantityDecrease}
            className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-md"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-1 min-w-[50px] text-center font-medium">
            {item.quantity}
          </span>
          <button
            onClick={handleQuantityIncrease}
            className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-md"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="font-semibold text-lg">{price}</span>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 ml-4"
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
