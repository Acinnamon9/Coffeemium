import React from "react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDetailPageProps {
  params: { slug: string };
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
  const { slug } = params;

  // Placeholder for product data fetching (e.g., from an API based on slug)
  const product = {
    name: `Coffee: ${slug
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")}`,
    description: `A delightful coffee experience from the ${slug.replace(/-/g, " ")} region. Known for its unique flavor profile and rich aroma.`,
    price: 20.0,
    images: [
      "/images/coffee-detail-1.jpg",
      "/images/coffee-detail-2.jpg",
      "/images/coffee-detail-3.jpg",
    ],
    origin: "Placeholder Region",
    flavorNotes: "Chocolate, Caramel, Nutty",
    roastProfile: "Medium",
    availableRoasts: ["Light", "Medium", "Dark"],
    availableGrinds: ["Whole Bean", "French Press", "Espresso", "Filter"],
  };

  // State for selected roast and grind (client-side logic)
  const [selectedRoast, setSelectedRoast] = React.useState(
    product.availableRoasts[0]
  );
  const [selectedGrind, setSelectedGrind] = React.useState(
    product.availableGrinds[0]
  );
  const [currentPrice, setCurrentPrice] = React.useState(product.price);

  // Dynamic price update logic (example: different roast/grind could affect price)
  React.useEffect(() => {
    // In a real app, this would involve more complex logic or server-side calls
    // For now, we'll just use the base price
    setCurrentPrice(product.price);
  }, [selectedRoast, selectedGrind, product.price]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="lg:col-span-1">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg shadow-md"
            />
            {/* Add small thumbnail carousel here */}
          </div>

          {/* Product Details */}
          <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-indigo-600 mb-6">
              ${currentPrice.toFixed(2)}
            </p>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Origin:</h3>
                <p className="text-gray-600">{product.origin}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Flavor Notes:
                </h3>
                <p className="text-gray-600">{product.flavorNotes}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Roast Profile:
                </h3>
                <p className="text-gray-600">{product.roastProfile}</p>
              </div>
            </div>

            {/* Select Roast */}
            <div className="mb-6">
              <label
                htmlFor="roast-select"
                className="block text-gray-800 text-lg font-semibold mb-2"
              >
                Select Roast:
              </label>
              <Select
                onValueChange={setSelectedRoast}
                defaultValue={selectedRoast}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a roast" />
                </SelectTrigger>
                <SelectContent>
                  {product.availableRoasts.map((roast) => (
                    <SelectItem key={roast} value={roast}>
                      {roast}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Grind */}
            <div className="mb-8">
              <label
                htmlFor="grind-select"
                className="block text-gray-800 text-lg font-semibold mb-2"
              >
                Select Grind:
              </label>
              <Select
                onValueChange={setSelectedGrind}
                defaultValue={selectedGrind}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a grind" />
                </SelectTrigger>
                <SelectContent>
                  {product.availableGrinds.map((grind) => (
                    <SelectItem key={grind} value={grind}>
                      {grind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              size="lg"
              className="w-full py-3 text-xl"
              onClick={() => (window.location.href = "/shop")}
            >
              Back to Shop
            </Button>

            {/* Optional: Brew Guide Section */}
            <div className="mt-12 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Brew Guide
              </h3>
              <p className="text-gray-700">
                Pairs best with pour-over for a nuanced flavor profile. Use 20g
                of coffee per 300ml of water, brewed at 92°C.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
