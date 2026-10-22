"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { fireConfetti } from "@/lib/confetti";

type Bundle = { id: string; name: string; description: string; image: string; bundlePrice: number; items: { product: { name: string; basePrice: number } }[] };

export default function CuratedBundles({ bundles }: { bundles: Bundle[] }) {
  const { isSignedIn } = useUser();
  const [adding, setAdding] = useState<string | null>(null);
  const currency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  async function addBundle(bundle: Bundle, button: HTMLButtonElement) {
    if (!isSignedIn) { toast.error("Please sign in to add a bundle."); return; }
    setAdding(bundle.id);
    const response = await fetch(`/api/bundles/${bundle.id}`, { method: "POST" });
    setAdding(null);
    if (response.ok) {
      fireConfetti(button);
      toast.success(`${bundle.name} added to your cart.`);
    }
    else toast.error("Could not add this bundle. Please try again.");
  }

  if (!bundles.length) return null;
  return <section className="bg-[#f4ede5] py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b46]">Save when you explore</p><h2 className="text-3xl font-bold text-[#3b281e] sm:text-4xl">Curated Coffee Bundles</h2></div><p className="hidden max-w-sm text-right text-gray-600 sm:block">Thoughtful combinations for your morning ritual, bundled at a better price.</p></div><div className="grid gap-6 md:grid-cols-2">{bundles.map((bundle) => { const regular = bundle.items.reduce((sum, item) => sum + item.product.basePrice, 0); const savings = regular - bundle.bundlePrice; return <article key={bundle.id} className="grid overflow-hidden rounded-3xl border border-[#e4d6c8] bg-white shadow-sm sm:grid-cols-[0.9fr_1.1fr]"><div className="relative min-h-56"><Image src={bundle.image} alt="" fill className="object-cover" /></div><div className="p-6"><div className="mb-4 flex items-start justify-between gap-3"><h3 className="text-2xl font-bold text-[#3b281e]">{bundle.name}</h3><span className="whitespace-nowrap rounded-full bg-[#f7dfc5] px-3 py-1 text-xs font-bold text-[#8b5e3c]">Save {currency(savings)}</span></div><p className="text-sm leading-6 text-gray-600">{bundle.description}</p><ul className="mt-4 space-y-1 text-sm text-gray-700">{bundle.items.map(({ product }) => <li key={product.name}>• {product.name}</li>)}</ul><div className="mt-5 flex items-end gap-3"><span className="text-sm text-gray-400 line-through">{currency(regular)}</span><span className="text-2xl font-bold text-[#3b281e]">{currency(bundle.bundlePrice)}</span></div><Button onClick={(event) => addBundle(bundle, event.currentTarget)} disabled={adding === bundle.id} className="mt-5 w-full rounded-full bg-[#3b281e] hover:bg-[#563b2b]">{adding === bundle.id ? "Adding…" : "Add entire bundle"}</Button></div></article>;})}</div></div></section>;
}
