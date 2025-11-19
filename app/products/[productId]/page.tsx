import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export async function generateStaticParams() {
  // For a real application, you would fetch your product IDs from a database
  // For now, let's mock a few product IDs
  return [
    { productId: "ethiopian-yirgacheffe-coffee" },
    { productId: "colombian-supremo-coffee" },
    { productId: "brazilian-santos-coffee" },
  ];
}

export default function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  // In a real application, you would fetch product details based on the productId
  // For now, we'll use mock data
  const mockProduct = {
    name: productId
      ? productId
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Unknown Product",
    description: productId
      ? `This is a detailed description for ${productId.replace(
          /-/g,
          " "
        )}. It's a fantastic product with amazing features and benefits.`
      : "This is a detailed description for an unknown product.",
    // use a numeric price for cart calculations
    price: 15.99,
    imageUrl: "/placeholder.jpg", // You can add a placeholder image in your public folder
  };

  return (
    <section className="container mx-auto py-16 px-4">
      <Card className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4">
          <Image
            src={mockProduct.imageUrl}
            alt={mockProduct.name}
            width={500}
            height={500}
            className="rounded-md object-cover"
          />
        </div>
        <div className="md:w-1/2 p-4 flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-amber-800 text-4xl mb-2">
              {mockProduct.name}
            </CardTitle>
            <CardDescription className="text-lg">
              {mockProduct.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <p className="text-2xl font-semibold text-gray-900 mb-4">
              ${mockProduct.price.toFixed(2)}
            </p>
            <div className="flex space-x-2">
              <Button className="bg-white border border-gray-200 text-gray-900 text-lg px-6 py-3">
                Buy Now
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
