"use client";
import useSWR from "swr";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "@/hooks/useDebounce"; // we will create this below

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsClient() {
  const { data, isLoading } = useSWR("/api/products", fetcher);

  const products = data?.products ?? [];

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // smoother search

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p: any) =>
      (p.name || "").toLowerCase().includes(q)
    );
  }, [products, debouncedQuery]);

  return (
    <div>
      <div className="mb-8">
        <SearchBar initialQuery="" onSearch={setQuery} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm"
            >
              <motion.div
                className="w-full h-40 bg-gray-200 animate-pulse rounded-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-1/2" />
              <div className="h-10 bg-gray-200 animate-pulse rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((product: any) => (
              <motion.div
                key={String(product.id)}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
