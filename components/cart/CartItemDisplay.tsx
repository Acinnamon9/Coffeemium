"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import { CartItem, Roast, GrindOption } from "../../app/cart/cart.types";
import { Coffee } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const currentRoastId = item.roastId ?? "";
  const currentGrindId = item.grindOptionId ?? "";

  const selectedRoast = roasts.find((r) => r.id === currentRoastId);
  const selectedGrind = grindOptions.find((g) => g.id === currentGrindId);

  const roastMultiplier = selectedRoast?.defaultMultiplier ?? 1.0;
  const grindExtraCost = selectedGrind?.extraCost ?? 0;
  const adjustedPrice = item.basePrice * roastMultiplier + grindExtraCost;
  const totalPrice = adjustedPrice * item.quantity;
  const price = `₹${totalPrice.toFixed(2)}`;

  const handleQuantityIncrease = () =>
    onQuantityChange(item.id, item.quantity + 1);
  const handleQuantityDecrease = () => {
    const newQty = item.quantity - 1;
    if (newQty >= 0) {
      onQuantityChange(item.id, newQty);
    }
  };

  const handleRemove = () => onRemoveItem(item.id);

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
              <span className="inline-flex items-center justify-center p-1 bg-[#d4a373]/10 rounded-full text-[#d4a373]">
                <Coffee className="w-3 h-3" />
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500">
            ₹{item.basePrice.toFixed(2)} each
          </p>

          {/* Roast Dropdown */}
          <Select
            value={currentRoastId}
            onValueChange={(value) =>
              onUpdateItemOptions(item.id, { roastId: value })
            }
          >
            <SelectTrigger className="mt-2 rounded-lg border-gray-300 focus:ring-amber-500 text-sm">
              <SelectValue placeholder="Choose Roast" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {roasts.map((roast) => (
                <SelectItem key={roast.id} value={roast.id} className="text-sm">
                  {roast.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Grind Dropdown */}
          <Select
            value={currentGrindId}
            onValueChange={(value) =>
              onUpdateItemOptions(item.id, { grindOptionId: value })
            }
          >
            <SelectTrigger className="mt-2 rounded-lg border-gray-300 focus:ring-amber-500 text-sm">
              <SelectValue placeholder="Grind Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {grindOptions.map((grind) => (
                <SelectItem key={grind.id} value={grind.id} className="text-sm">
                  {grind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Pricing Breakdown */}
          <div className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="flex justify-between">
              <span>Base price:</span>
              <span className="font-medium">₹{item.basePrice.toFixed(2)}</span>
            </p>
            <p className="flex justify-between mt-1">
              <span>Roast x {roastMultiplier.toFixed(2)}</span>
              <span className="font-medium">{selectedRoast?.name}</span>
            </p>
            <p className="flex justify-between mt-1">
              <span>Grind + ₹{grindExtraCost.toFixed(2)}</span>
              <span className="font-medium">{selectedGrind?.name}</span>
            </p>
            <div className="border-t border-gray-300 mt-2 pt-2">
              <p className="flex justify-between font-medium text-gray-800">
                <span>Item price:</span>
                <motion.span
                  key={adjustedPrice}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  ₹{adjustedPrice.toFixed(2)}
                </motion.span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleQuantityDecrease}
              className="px-3 py-1 hover:bg-gray-100 rounded-l-md"
            >
              -
            </button>
            <span className="px-4 py-1 min-w-[50px] text-center font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleQuantityIncrease}
              className="px-3 py-1 hover:bg-gray-100 rounded-r-md"
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
        >
          Remove
        </button>
      </div>
    </div>
  );
};
