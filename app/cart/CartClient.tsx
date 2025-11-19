"use client";

import { CartItemDisplay } from "@/components/cart/CartItemDisplay";
import CartHeader from "@/components/cart/CartHeader";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";

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

      <main className="grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Cart Items */}
            <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Items</h2>

              {cartItems.map((item) => (
                <CartItemDisplay
                  key={item.id}
                  item={item}
                  isLoggedIn={isLoggedIn}
                  roasts={roasts}
                  grindOptions={grindOptions}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveItem}
                  onUpdateItemOptions={handleUpdateItemOptions}
                />
              ))}
            </section>

            {/* RIGHT: Order Summary */}
            <OrderSummary
              totalItems={totalItems}
              formattedTotalPrice={formattedTotalPrice}
            />
          </div>
        )}
      </main>
    </div>
  );
}
