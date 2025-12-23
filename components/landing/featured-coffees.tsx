import { prisma } from "@/lib/prisma";
import ProductCard from "../shop/ProductCard";
import type { ProductModel } from "@/app/generated/prisma/models/Product";

async function FeaturedCoffees() {
  const featuredCoffees = await prisma.product.findMany({
    take: 3,
    orderBy: {
      basePrice: "desc",
    },
    include: {
      productRoasts: {
        include: {
          roast: true,
        },
      },
    },
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Premium Selections
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

            // Sanitize data for Client Component to avoid passing Dates
            const serializedProduct = {
              id: coffee.id,
              name: coffee.name,
              description: coffee.description,
              image: coffee.image,
              basePrice: coffee.basePrice,
            };

            return (
              <ProductCard
                key={coffee.id}
                product={serializedProduct}
                badge={badge}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCoffees;
