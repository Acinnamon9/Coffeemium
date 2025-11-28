"use client";

import { CartItemDisplay } from "@/components/cart/CartItemDisplay";
import CartHeader from "@/components/cart/CartHeader";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
export default function CartClient() {
  const {
    cartItems,
    roasts,
    grindOptions,
    loading,
    error,
    isLoggedIn,
    totalItems,
    formattedTotalPrice,
    handleQuantityChange,
    handleRemoveItem,
    handleUpdateItemOptions,
  } = useCart();

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Wrapper callbacks to show toast feedback
  const handleQuantityChangeWithToast = (itemId: string, qty: number) => {
    handleQuantityChange(itemId, qty);
    triggerToast("Quantity updated");
  };
  const handleRemoveItemWithToast = (itemId: string) => {
    handleRemoveItem(itemId);
    console.log(itemId); //to be removed later
    triggerToast("Item removed");
  };
  const handleUpdateItemOptionsWithToast = async (
    itemId: string,
    updates: { roastId?: string | null; grindOptionId?: string | null }
  ) => {
    const cleanUpdates: { roastId?: string; grindOptionId?: string } = {};
    if (updates.roastId != null) cleanUpdates.roastId = updates.roastId;
    if (updates.grindOptionId != null)
      cleanUpdates.grindOptionId = updates.grindOptionId;
    await handleUpdateItemOptions(itemId, cleanUpdates);
    triggerToast("Item options updated");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CartHeader />

      <main className="grow px-6 pt-12 pb-20 bg-[#f8fafc] animate-fade-in">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-12 text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 max-w-7xl mx-auto">
            {/* LEFT: Cart Items */}
            <section className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 tracking-tight text-gray-800">
                Items
              </h2>

              {cartItems.map((item) => {
                // Create unique key from productId + roastId + grindOptionId
                // This matches the database unique constraint
                const uniqueKey = `${item.id}-${item.roastId ?? "no-roast"}-${item.grindOptionId ?? "no-grind"}`;

                return (
                  <CartItemDisplay
                    key={uniqueKey}
                    item={item}
                    isLoggedIn={isLoggedIn}
                    roasts={roasts}
                    grindOptions={grindOptions}
                    onQuantityChange={handleQuantityChangeWithToast}
                    onRemoveItem={handleRemoveItemWithToast}
                    onUpdateItemOptions={handleUpdateItemOptionsWithToast}
                  />
                );
              })}
            </section>

            {/* RIGHT: Order Summary */}
            <OrderSummary
              totalItems={totalItems}
              formattedTotalPrice={formattedTotalPrice}
            />
          </div>
        )}
      </main>
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
