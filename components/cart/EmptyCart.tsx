"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
      <Link href="/shop">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
