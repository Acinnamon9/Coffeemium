"use client";

import Image from "next/image";
import Link from "next/link";
import ProductDetailActions from "@/components/shop/ProductDetailActions";
import { useDemoProduct, type DemoProduct } from "@/lib/demo-products";

type ProductDetail = DemoProduct & {
  detail?: { fullDescription: string } | null;
  productRoasts: { roast: { id: string; name: string } }[];
};

export default function ProductDetailView({ product }: { product: ProductDetail }) {
  const displayedProduct = useDemoProduct(product);
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(displayedProduct.basePrice);

  return (
    <>
      <Link href="/shop" className="mb-8 inline-block text-sm font-medium text-[#8b5e3c] hover:underline">← Back to shop</Link>
      <section className="grid overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm md:grid-cols-2">
        <div className="bg-[#f4ede5] p-6 sm:p-10">
          <Image src={displayedProduct.image ?? "/images/Logo/Coffeemium.png"} alt={displayedProduct.name} width={700} height={700} sizes="(max-width: 768px) 100vw, 50vw" className="aspect-square w-full rounded-2xl object-cover" priority />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b46]">Freshly roasted</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#3b281e] sm:text-5xl">{displayedProduct.name}</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">{displayedProduct.detail?.fullDescription || displayedProduct.description}</p>
          <p className="mt-8 text-3xl font-semibold text-[#3b281e]">{price}</p>
          {displayedProduct.productRoasts.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Available roasts</p>
              <div className="flex flex-wrap gap-2">
                {displayedProduct.productRoasts.map(({ roast }) => <span key={roast.id} className="rounded-full bg-[#f2e8dc] px-3 py-1 text-sm text-[#6b4630]">{roast.name}</span>)}
              </div>
            </div>
          )}
          <ProductDetailActions product={{ id: displayedProduct.id, name: displayedProduct.name, basePrice: displayedProduct.basePrice, image: displayedProduct.image ?? "" }} />
        </div>
      </section>
    </>
  );
}
