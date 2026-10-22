import ProductCard from "../shop/ProductCard";
import { getStorefrontProducts } from "@/lib/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function FeaturedCoffees() {
  const featuredCoffees = (await getStorefrontProducts()).slice(0, 3);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          <Link href="/shop" className="transition-colors hover:text-[#8b5e3c] focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5e3c]">
            Premium Selections
          </Link>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCoffees.map((coffee, index) => {
            let badge = "";
            if (index === 0) {
              badge = "Single Origin";
            } else if (index === 1) {
              badge = "Best Seller";
            } else if (index === 2) {
              badge = "On Repeat";
            }
            return (
              <ProductCard key={coffee.id} product={coffee} badge={badge} />
            );
          })}
        </div>
        <div className="mt-8 mr-[-1rem] flex justify-end sm:mr-[-1.5rem] lg:mr-[-2rem]">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-[#8b5e3c]/30 bg-[#fbf7f2] px-5 py-3 text-sm font-semibold text-[#3b281e] shadow-sm transition-colors duration-200 hover:border-[#8b5e3c] hover:bg-[#f2e8dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5e3c]"
          >
            Explore all coffees
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transition-none" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCoffees;
