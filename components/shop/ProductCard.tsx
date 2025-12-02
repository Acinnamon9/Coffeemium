"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  image?: string;
  basePrice: number;
};

export default function ProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: string;
}) {
  const { addToCart, loading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.basePrice);

  const handleAddToCart = async () => {
    if (cartLoading || isAdding) return;

    setIsAdding(true);
    const result = await addToCart(product);
    setIsAdding(false);

    if (result.success) {
      toast.success(`${product.name} was added to cart successfully.`, {
        duration: 2500,
      });
    } else {
      toast.error(
        result.error ?? "Failed to add to cart. Something went wrong."
      );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ duration: 0.18 }}
      className="cursor-pointer"
    >
      <Card className="flex flex-col shadow-sm">
        <CardHeader>
          <CardTitle className="truncate">{product.name}</CardTitle>
          {product.description && (
            <CardDescription className="truncate">
              {product.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="grow">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className="w-full aspect-square object-contain mb-4 rounded-md"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 mb-4 rounded-md" />
          )}

          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">{price}</p>
            {badge && (
              <Badge className="bg-[#eedacc] text-[#E57F3A] border-[#E57F3A] shadow-sm">
                {badge}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full">View Details</Button>

          <Button
            variant="outline"
            onClick={handleAddToCart}
            disabled={isAdding || cartLoading}
            className="w-full"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
