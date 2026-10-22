// /app/api/products/route.ts
import { getStorefrontProducts } from "@/lib/products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await getStorefrontProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error("Products fetch failed", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
