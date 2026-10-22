import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import ProductsClient from "@/components/shop/ProductsClient";
import CoffeeFinder from "@/components/shop/CoffeeFinder";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b46]">Find your daily ritual</p>
          <h1 className="text-4xl font-bold text-gray-800">Our Coffees</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">Explore single origins, comforting blends, and grind options made for the way you brew.</p>
        </div>

        <div>
          <div className="mb-8"><CoffeeFinder /></div>
          <section>
            {/* ProductsClient now fetches data via API */}
            <ProductsClient />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
