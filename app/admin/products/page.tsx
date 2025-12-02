import { prisma } from "@/lib/prisma";
import ProductForm from "./product-form";
import DeleteProductButton from "./delete-product-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Current Products</h2>
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow border"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${product.basePrice.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${product.stock === 0 ? "text-red-500 font-bold" : "text-gray-600"}`}
                    >
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteProductButton id={product.id} />
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500">No products found.</p>
            )}
          </div>
        </div>

        <div>
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
