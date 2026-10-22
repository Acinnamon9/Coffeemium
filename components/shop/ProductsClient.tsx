"use client";
import useSWR from "swr";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "@/hooks/useDebounce"; // we will create this below
import { useDemoProducts, type DemoProduct } from "@/lib/demo-products";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Product = DemoProduct & {
  productRoasts?: { roast?: { name: string } | null }[];
};

export default function ProductsClient() {
  const { data, isLoading } = useSWR("/api/products", fetcher);

  const products = useDemoProducts((data?.products ?? []) as Product[]);

  const [query, setQuery] = useState("");
  const [roast, setRoast] = useState("all");
  const [sort, setSort] = useState("featured");
  const debouncedQuery = useDebounce(query, 300); // smoother search

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const result = products.filter((p) => {
      const matchesQuery = !q || `${p.name} ${p.description || ""}`.toLowerCase().includes(q);
      const matchesRoast = roast === "all" || p.productRoasts?.some((r) => r.roast?.name === roast);
      return matchesQuery && matchesRoast;
    });
    return [...result].sort((a, b) => sort === "price-low" ? a.basePrice - b.basePrice : sort === "price-high" ? b.basePrice - a.basePrice : 0);
  }, [products, debouncedQuery, roast, sort]);

  const roastOptions = Array.from(new Set(products.flatMap((p) => p.productRoasts?.map((r) => r.roast?.name).filter((name): name is string => Boolean(name)) ?? [])));

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <SearchBar initialQuery="" onSearch={setQuery} />
        <select aria-label="Filter by roast" value={roast} onChange={(e) => setRoast(e.target.value)} className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm">
          <option value="all">All roasts</option>
          {roastOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm">
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-gray-500" aria-live="polite">{filtered.length} {filtered.length === 1 ? "coffee" : "coffees"} found</p>

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
            {filtered.map((product) => (
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
      {!isLoading && filtered.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center"><h2 className="text-xl font-semibold">No coffees match those filters</h2><p className="mt-2 text-gray-500">Try another search or clear your filters.</p></div>}
    </div>
  );
}
