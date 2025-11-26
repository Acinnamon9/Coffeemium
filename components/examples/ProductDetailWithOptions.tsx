"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import { Coffee, ShoppingCart } from "lucide-react";

interface ProductDetailWithOptionsProps {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    basePrice: number;
  };
  roasts: Array<{
    id: string;
    name: string;
    defaultMultiplier: number;
  }>;
  grindOptions: Array<{
    id: string;
    name: string;
    extraCost: number;
  }>;
}

/**
 * Example component showing how to add products to cart with roast and grind options.
 * This demonstrates the multi-configuration cart support.
 */
export default function ProductDetailWithOptions({
  product,
  roasts,
  grindOptions,
}: ProductDetailWithOptionsProps) {
  const { addToCart, loading: cartLoading } = useCart();

  const [selectedRoastId, setSelectedRoastId] = useState(roasts[0]?.id || "");
  const [selectedGrindId, setSelectedGrindId] = useState(
    grindOptions[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  // Calculate price based on selections
  const selectedRoast = roasts.find((r) => r.id === selectedRoastId);
  const selectedGrind = grindOptions.find((g) => g.id === selectedGrindId);

  const roastMultiplier = selectedRoast?.defaultMultiplier ?? 1.0;
  const grindExtraCost = selectedGrind?.extraCost ?? 0;
  const adjustedPrice = product.basePrice * roastMultiplier + grindExtraCost;
  const totalPrice = adjustedPrice * quantity;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(totalPrice);

  const handleAddToCart = async () => {
    if (cartLoading || isAdding) return;

    setIsAdding(true);
    setMessage("");

    const result = await addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        basePrice: product.basePrice,
      },
      quantity,
      {
        roastId: selectedRoastId,
        grindOptionId: selectedGrindId,
      }
    );

    if (result.success) {
      setMessage(`✓ Added ${quantity}x ${product.name} to cart!`);
      // Reset quantity after successful add
      setQuantity(1);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(`✗ Failed: ${result.error}`);
    }

    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Coffee className="w-24 h-24 text-gray-300" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              {product.name}
              <Coffee className="w-6 h-6 text-[#d4a373]" />
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Price Display */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Base price:</span>
              <span className="font-medium">
                ₹{product.basePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Roast adjustment:</span>
              <span
                className={`font-medium ${roastMultiplier !== 1 ? "text-[#d4a373]" : ""}`}
              >
                × {roastMultiplier.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Grind adjustment:</span>
              <span
                className={`font-medium ${grindExtraCost !== 0 ? "text-[#d4a373]" : ""}`}
              >
                + ₹{grindExtraCost.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-300 mt-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold text-[#d4a373]"
                >
                  {formattedPrice}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Roast Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Roast Level
            </label>
            <select
              value={selectedRoastId}
              onChange={(e) => setSelectedRoastId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
            >
              {roasts.map((roast) => (
                <option key={roast.id} value={roast.id}>
                  {roast.name} (×{roast.defaultMultiplier.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Grind Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Grind Option
            </label>
            <select
              value={selectedGrindId}
              onChange={(e) => setSelectedGrindId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
            >
              {grindOptions.map((grind) => (
                <option key={grind.id} value={grind.id}>
                  {grind.name} (+₹{grind.extraCost.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-xl font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || cartLoading}
            className="w-full bg-[#d4a373] text-white py-4 rounded-lg font-semibold hover:bg-[#c49363] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {isAdding ? "Adding to Cart..." : "Add to Cart"}
          </button>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-center ${
                message.startsWith("✓")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> You can add this product multiple times
              with different roast and grind combinations. Each unique
              configuration will appear as a separate item in your cart!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
