"use client";
import { Button } from "@/components/ui/button";

interface Props {
  totalItems: number;
  formattedTotalPrice: string;
}

export default function OrderSummary({
  totalItems,
  formattedTotalPrice,
}: Props) {
  return (
    <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2 text-gray-700">
        <span>Items ({totalItems})</span>
        <span>{formattedTotalPrice}</span>
      </div>
      <div className="flex justify-between mb-6 text-gray-700">
        <span>Shipping</span>
        <span className="font-semibold">Calculated at checkout</span>
      </div>
      <hr className="mb-6" />
      <div className="flex justify-between font-bold text-xl mb-8">
        <span>Total</span>
        <span>{formattedTotalPrice}</span>
      </div>
      <Button
        className="w-full py-3"
        onClick={() => alert("Proceed to checkout!")}
      >
        Proceed to Checkout
      </Button>
    </aside>
  );
}
