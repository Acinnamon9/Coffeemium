import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import ProductsClient from "@/components/shop/ProductsClient";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Our Coffees
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Column */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Filters</h2>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Region</h3>
              <p className="text-gray-500">Region filter options...</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Roast Type</h3>
              <p className="text-gray-500">Roast type filter options...</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
              <p className="text-gray-500">Price range filter options...</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Flavor Notes</h3>
              <p className="text-gray-500">Flavor notes filter options...</p>
            </div>
          </aside>

          {/* Products Column */}
          <section className="lg:col-span-3">
            {/* ProductsClient now fetches data via API */}
            <ProductsClient />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
