import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import ProductDetailActions from "@/components/shop/ProductDetailActions";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { detail: true, productRoasts: { include: { roast: true } } },
  });

  if (!product) notFound();

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.basePrice);

  return (
    <div className="min-h-screen bg-[#fbf8f3]">
      <Header />
      <main className="container mx-auto px-4 py-12 sm:py-20">
        <Link href="/shop" className="mb-8 inline-block text-sm font-medium text-[#8b5e3c] hover:underline">← Back to shop</Link>
        <section className="grid overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm md:grid-cols-2">
          <div className="bg-[#f4ede5] p-6 sm:p-10">
            <Image src={product.image} alt={product.name} width={700} height={700} className="aspect-square w-full rounded-2xl object-cover" priority />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b46]">Freshly roasted</p>
            <h1 className="text-4xl font-bold tracking-tight text-[#3b281e] sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">{product.detail?.fullDescription || product.description}</p>
            <p className="mt-8 text-3xl font-semibold text-[#3b281e]">{price}</p>
            {product.productRoasts.length > 0 && <div className="mt-6"><p className="mb-2 text-sm font-semibold">Available roasts</p><div className="flex flex-wrap gap-2">{product.productRoasts.map(({ roast }) => <span key={roast.id} className="rounded-full bg-[#f2e8dc] px-3 py-1 text-sm text-[#6b4630]">{roast.name}</span>)}</div></div>}
            <ProductDetailActions product={{ id: product.id, name: product.name, basePrice: product.basePrice, image: product.image }} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
