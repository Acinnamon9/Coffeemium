"use client";
import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";

type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  image?: string | null;
  basePrice: number;
};

export default function ProductsClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, query]);

  return (
    <div>
      <div className="mb-8">
        <SearchBar initialQuery="" onSearch={setQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
        {filtered.map((product) => (
          <ProductCard key={String(product.id)} product={product} />
        ))}
      </div>
    </div>
  );
}
