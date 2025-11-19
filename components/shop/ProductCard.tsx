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
import { useState } from "react";
import Image from "next/image";

type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  image?: string | null;
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
  const [message, setMessage] = useState("");

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.basePrice);

  const handleAddToCart = async () => {
    if (cartLoading || isAdding) return;

    setIsAdding(true);
    setMessage("");

    const result = await addToCart(product);

    if (result.success) {
      setMessage(`${product.name} added to cart!`);
    } else {
      setMessage(`Failed: ${result.error}`);
    }

    setIsAdding(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
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
          <p className="text-gray-600">{price}</p>
          {badge && (
            <Badge className="bg-[#eedacc] text-[#E57F3A] border-[#E57F3A] shadow-md">
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

        {message && (
          <span className="text-sm text-green-600 text-center">{message}</span>
        )}
      </CardFooter>
    </Card>
  );
}
