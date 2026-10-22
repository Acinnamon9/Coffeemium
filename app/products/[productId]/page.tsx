import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import ProductDetailView from "@/components/shop/ProductDetailView";

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

  return (
    <div className="min-h-screen bg-[#fbf8f3]">
      <Header />
      <main className="container mx-auto px-4 py-12 sm:py-20">
        <ProductDetailView product={product} />
      </main>
      <Footer />
    </div>
  );
}
