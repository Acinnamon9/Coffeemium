"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    lastRemovedItem,
    undoRemoveItem,
  } = useCart();

  const [toastMessage, setToastMessage] = useState<string>("");
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleQuantityChangeWithToast = (itemId: string, qty: number) => {
    handleQuantityChange(itemId, qty);
    triggerToast("Quantity updated");
  };

  const handleRemoveItemWithToast = (itemId: string) => {
    handleRemoveItem(itemId);
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse">
        Loading cart...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CartHeader />

      <main className="grow px-6 pt-12 pb-20 bg-[#f8fafc]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-semibold tracking-tight text-gray-900 mb-12 text-center"
        >
          Your Cart
        </motion.h1>

        <AnimatePresence mode="popLayout">
          {cartItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyCart />
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 max-w-7xl mx-auto"
            >
              <section className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 tracking-tight text-gray-800">
                  Items
                </h2>

                <AnimatePresence>
                  {cartItems.map((item) => {
                    const uniqueKey = `${item.id}-${item.roastId ?? "no-roast"}-${item.grindOptionId ?? "no-grind"}`;

                    return (
                      <motion.div
                        key={uniqueKey}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <CartItemDisplay
                          item={item}
                          isLoggedIn={isLoggedIn}
                          roasts={roasts}
                          grindOptions={grindOptions}
                          onQuantityChange={handleQuantityChangeWithToast}
                          onRemoveItem={handleRemoveItemWithToast}
                          onUpdateItemOptions={handleUpdateItemOptionsWithToast}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </section>

              <OrderSummary
                totalItems={totalItems}
                formattedTotalPrice={formattedTotalPrice}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="toast"
          >
            {toastMessage}
          </motion.div>
        )}
        {lastRemovedItem && (
          <motion.div
            key="undo-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <span>Item removed</span>
            <button
              onClick={undoRemoveItem}
              className="text-amber-400 font-semibold hover:underline"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
