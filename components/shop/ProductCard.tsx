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
import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDemoProduct, type DemoProduct } from "@/lib/demo-products";
import { fireConfetti } from "@/lib/confetti";

type Product = DemoProduct;

export default function ProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: string;
}) {
  const displayedProduct = useDemoProduct(product);
  const { addToCart, loading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(displayedProduct.basePrice);

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    if (cartLoading || isAdding) return;

    const button = event.currentTarget;
    setIsAdding(true);
    const result = await addToCart(displayedProduct);
    setIsAdding(false);

    if (result.success) {
      fireConfetti(button);
      toast.success(`${displayedProduct.name} was added to cart successfully.`, {
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
      className="group"
    >
      <Card className="flex flex-col shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="truncate text-lg"><Link href={`/products/${displayedProduct.id}`} className="hover:text-[#8b5e3c]">{displayedProduct.name}</Link></CardTitle>
          {displayedProduct.description && (
            <CardDescription className="truncate">
              {displayedProduct.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="grow">
          {displayedProduct.image ? (
            <Image
              src={displayedProduct.image}
              alt={displayedProduct.name}
              width={100}
              height={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 320px"
              quality={75}
              className="mb-4 aspect-square w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
          {displayedProduct.category && <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#9a6b46]">{displayedProduct.category.replace("-", " ")}</p>}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-[#3b281e] hover:bg-[#563b2b]"><Link href={`/products/${displayedProduct.id}`}>View Details</Link></Button>

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
