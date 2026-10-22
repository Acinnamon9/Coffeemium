"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetDemoProducts,
  saveDemoProductOverride,
  getDemoProductOverride,
  type DemoProduct,
  type DemoProductOverride,
} from "@/lib/demo-products";

type Field = keyof DemoProductOverride;

export default function DemoStudio({ products }: { products: DemoProduct[] }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [draft, setDraft] = useState<DemoProductOverride>(() => {
    const product = products[0];
    return product
      ? {
          name: product.name,
          description: product.description ?? "",
          image: product.image ?? "",
          basePrice: product.basePrice,
          ...getDemoProductOverride(product.id),
        }
      : {};
  });
  const selectedProduct = products.find((product) => product.id === selectedId);

  const previewProducts = useMemo(() => products.slice(0, 3), [products]);

  function updateField(field: Field, value: string) {
    const nextDraft = {
      ...draft,
      [field]: field === "basePrice" ? Number(value) : value,
    };
    setDraft(nextDraft);
    saveDemoProductOverride(selectedId, nextDraft);
  }

  function reset() {
    resetDemoProducts();
    setDraft({
      name: selectedProduct?.name ?? "",
      description: selectedProduct?.description ?? "",
      image: selectedProduct?.image ?? "",
      basePrice: selectedProduct?.basePrice ?? 0,
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-[#3b281e] p-8 text-white shadow-lg sm:p-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#f4d9b8]">
          Interactive brand storefront demo
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Make this coffee store feel like your brand.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
          Change a product below and see the storefront update instantly. Your
          edits are saved only in this browser, so you can explore safely.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl border border-[#eadfd3] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#3b281e]">Customize a product</h2>
              <p className="mt-1 text-sm text-gray-500">Try a new name, price, description, or image path.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              Reset demo
            </Button>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSelectedId(product.id);
                  setDraft({
                    name: product.name,
                    description: product.description ?? "",
                    image: product.image ?? "",
                    basePrice: product.basePrice,
                    ...getDemoProductOverride(product.id),
                  });
                }}
                className={`rounded-full border px-3 py-2 text-left text-sm transition ${selectedId === product.id ? "border-[#3b281e] bg-[#3b281e] text-white" : "border-gray-200 text-gray-700 hover:border-[#8b5e3c]"}`}
              >
                {product.name}
              </button>
            ))}
          </div>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="demo-name">Product name</Label>
                <Input id="demo-name" value={String(draft.name ?? "")} onChange={(event) => updateField("name", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="demo-description">Short description</Label>
                <Input id="demo-description" value={String(draft.description ?? "")} onChange={(event) => updateField("description", event.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo-price">Price (₹)</Label>
                  <Input id="demo-price" type="number" min="0" step="1" value={String(draft.basePrice ?? 0)} onChange={(event) => updateField("basePrice", event.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo-image">Image path</Label>
                  <Input id="demo-image" value={String(draft.image ?? "")} onChange={(event) => updateField("image", event.target.value)} />
                </div>
              </div>
              <p className="text-xs text-gray-500">Changes update the preview immediately and stay local to this browser.</p>
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b5e3c]">Live storefront preview</p>
              <h2 className="text-3xl font-bold text-[#3b281e]">Premium selections</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-[#8b5e3c] hover:underline">Open full shop →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {previewProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-[#eadfd3] bg-white p-6 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-[#3b281e]">Want this experience for your brand?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-gray-600">This demo can be adapted with your logo, colors, catalog, checkout rules, and customer journey.</p>
        <Button asChild className="mt-5 rounded-full bg-[#3b281e] px-6 hover:bg-[#563b2b]">
          <a href="mailto:hello@coffeemium.com?subject=I%20want%20a%20storefront%20like%20this">Start a brand storefront project</a>
        </Button>
      </div>
    </section>
  );
}
