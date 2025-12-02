"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  userId: string;
}

export default function CheckoutForm({ userId }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      userId,
      address: `${formData.get("address1")}, ${formData.get("address2") || ""}, ${formData.get("city")}, ${formData.get("pincode")}`,
      phone: formData.get("phone") as string,
      notes: (formData.get("notes") as string) || null,
      paymentMethod,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push(result.redirectUrl);
      } else {
        alert(result.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold">Checkout</h2>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address1">Address Line 1</Label>
          <Input id="address1" name="address1" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address2">Address Line 2 (Optional)</Label>
          <Input id="address2" name="address2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" name="pincode" required />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input id="notes" name="notes" />
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="w-4 h-4"
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
                className="w-4 h-4"
              />
              <span>Pay Online (Test Mode)</span>
            </label>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </form>
  );
}
