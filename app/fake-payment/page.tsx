"use client";

import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FakePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [processing, setProcessing] = useState(false);

  function handlePaymentSuccess() {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      router.push(`/order/success?orderId=${orderId || "unknown"}`);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-white p-8 rounded-lg shadow">
          <div className="text-6xl">💳</div>
          <h1 className="text-3xl font-bold">Test Payment Gateway</h1>
          <p className="text-gray-600">
            This is a simulated payment page. Click the button below to simulate
            a successful payment.
          </p>
          {orderId && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono">{orderId}</p>
            </div>
          )}
          <Button
            onClick={handlePaymentSuccess}
            disabled={processing}
            size="lg"
            className="w-full max-w-md"
          >
            {processing ? "Processing Payment..." : "Simulate Payment Success"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
