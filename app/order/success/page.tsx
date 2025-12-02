import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-white p-8 rounded-lg shadow">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-green-600">
            Order Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. Your order has been placed successfully.
          </p>
          {searchParams.orderId && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono text-lg">{searchParams.orderId}</p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
