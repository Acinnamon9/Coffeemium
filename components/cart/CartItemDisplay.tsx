"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import { CartItem, Roast, GrindOption } from "../../app/cart/cart.types";
import { Coffee } from "lucide-react";

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

export const CartItemDisplay = ({
  item,
  isLoggedIn,
  roasts,
  grindOptions,
  onQuantityChange,
  onRemoveItem,
  onUpdateItemOptions,
}: CartItemDisplayProps) => {
  const currentRoastId = item.roastId ?? roasts[0]?.id ?? "";
  const currentGrindId = item.grindOptionId ?? grindOptions[0]?.id ?? "";

  // Find selected roast and grind option objects
  const selectedRoast = roasts.find((r) => r.id === currentRoastId);
  const selectedGrind = grindOptions.find((g) => g.id === currentGrindId);

  // Calculate dynamic price: (basePrice × roastMultiplier) + grindExtraCost
  const roastMultiplier = selectedRoast?.defaultMultiplier ?? 1.0;
  const grindExtraCost = selectedGrind?.extraCost ?? 0;
  const adjustedPrice = item.basePrice * roastMultiplier + grindExtraCost;
  const totalPrice = adjustedPrice * item.quantity;

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(totalPrice);

  const handleQuantityIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    } else {
      // Keep quantity at 1 – removal requires explicit action
    }
  };

  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  const handleRoastChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    onUpdateItemOptions(item.id, { roastId: newId });
  };

  const handleGrindChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    onUpdateItemOptions(item.id, { grindOptionId: newId });
  };

  return (
    <div className="flex items-center justify-between border-b py-4 last:border-b-0 hover-scale transition-all duration-200 hover:shadow-sm rounded-lg px-2 -mx-2">
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
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {item.name}
            {/Coffee|Roast|Blend|Espresso/i.test(item.name) && (
              <span
                className="inline-flex items-center justify-center p-1 bg-[#d4a373]/10 rounded-full text-[#d4a373]"
                title="Coffee Product"
              >
                <Coffee className="w-3 h-3" />
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500">
            {(item.basePrice ?? 0).toFixed(2)} each
          </p>
          {/* Roast selector */}
          <select
            value={currentRoastId}
            onChange={handleRoastChange}
            className="mt-1 rounded border-gray-300"
            aria-label="Select roast"
          >
            {roasts.map((roast) => (
              <option key={roast.id} value={roast.id}>
                {roast.name}
              </option>
            ))}
          </select>
          {/* Grind selector */}
          <select
            value={currentGrindId}
            onChange={handleGrindChange}
            className="mt-1 rounded border-gray-300"
            aria-label="Select grind option"
          >
            {grindOptions.map((grind) => (
              <option key={grind.id} value={grind.id}>
                {grind.name}
              </option>
            ))}
          </select>

          {/* Pricing breakdown */}
          <div className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="flex justify-between items-center">
              <span>Base price:</span>
              <span className="font-medium">
                ₹{(item.basePrice ?? 0).toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between items-center mt-1">
              <span>
                Roast adjustment:
                {selectedRoast?.name && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({selectedRoast.name})
                  </span>
                )}
              </span>
              <span
                className={`font-medium ${roastMultiplier !== 1 ? "text-[#d4a373]" : ""}`}
              >
                × {roastMultiplier.toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between items-center mt-1">
              <span>
                Grind adjustment:
                {selectedGrind?.name && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({selectedGrind.name})
                  </span>
                )}
              </span>
              <span
                className={`font-medium ${grindExtraCost !== 0 ? "text-[#d4a373]" : ""}`}
              >
                + ₹{grindExtraCost.toFixed(2)}
              </span>
            </p>
            <div className="border-t border-gray-300 mt-2 pt-2">
              <p className="flex justify-between items-center font-medium text-gray-800">
                <span className="opacity-75">Item price:</span>
                <motion.span
                  key={adjustedPrice}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-base"
                >
                  ₹{adjustedPrice.toFixed(2)}
                </motion.span>
              </p>
              <p className="flex justify-between items-center text-xs text-gray-600 mt-1">
                <span>Quantity:</span>
                <span>× {item.quantity}</span>
              </p>
            </div>

            {/* Live difference indicator */}
            {(roastMultiplier !== 1 || grindExtraCost !== 0) && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-green-600 mt-2 flex items-center gap-1"
              >
                <Coffee className="w-3 h-3" />
                <span>Price adjusted based on your selections</span>
              </motion.p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn && (
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
        )}
        <motion.span
          key={totalPrice}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="font-semibold text-lg"
        >
          {price}
        </motion.span>
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
