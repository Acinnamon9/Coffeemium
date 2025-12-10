"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
interface Props {
  totalItems: number;
  formattedTotalPrice: string;
}
export default function OrderSummary({
  totalItems,
  formattedTotalPrice,
}: Props) {
  const router = useRouter();
  return (
    <aside className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 h-fit sticky top-28">
      {" "}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg text-[#6c47ff]">
          <ShoppingBag size={20} />
        </div>
        <h2 className="text-2xl font-semibold font-heading">Order Summary</h2>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totalItems} items)</span>
          <span className="font-medium text-gray-900">
            {formattedTotalPrice}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-gray-500 text-sm">Calculated at checkout</span>
        </div>
      </div>{" "}
      <Button
        className="w-full py-6 text-lg btn-brand hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-[#6c47ff]/25 flex items-center justify-center gap-2 group"
        onClick={() => router.push("/checkout")}
        disabled={totalItems === 0}
      >
        Proceed to Checkout
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
        <ShieldCheck size={14} />
        <span>Secure Checkout</span>
      </div>
    </aside>
  );
}
