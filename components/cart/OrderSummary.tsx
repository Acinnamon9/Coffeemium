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
    <aside className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 h-fit sticky top-28">
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
      <div className="flex justify-between font-bold text-xl mb-8 items-center">
        <span>Total</span>
        <span className="text-3xl text-[#6c47ff]">{formattedTotalPrice}</span>
      </div>
      <Button
        className="w-full py-6 text-lg btn-brand hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-[#6c47ff]/25"
        onClick={() => alert("Proceed to checkout!")}
      >
        Proceed to Checkout
      </Button>
    </aside>
  );
}
