import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import DemoStudio from "@/components/demo/DemoStudio";
import { getStorefrontProducts } from "@/lib/products";

export default async function DemoPage() {
  const products = (await getStorefrontProducts()).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fbf7f2] flex flex-col">
      <Header />
      <main className="grow">
        <DemoStudio products={products} />
      </main>
      <Footer />
    </div>
  );
}
