import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DealForm } from "./deal-form";

function toLocalInput(date?: Date) {
  if (!date) return "";
  return date.toISOString();
}

export default async function AdminDealsPage() {
  const { userId } = await auth();
  const allowed = (process.env.ADMIN_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean);
  if (!userId || !allowed.includes(userId)) redirect("/");
  const [products, deal] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, image: true }, orderBy: { name: "asc" } }),
    prisma.featuredDeal.findUnique({ where: { id: "primary" }, include: { products: true } }),
  ]);
  return <main className="min-h-screen bg-[#fbf8f3] px-4 py-10">
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="text-sm text-[#8b5e3c] hover:underline">← Admin Dashboard</Link>
      <h1 className="mt-4 text-3xl font-bold text-[#3b281e]">Featured Limited-Time Deal</h1>
      <p className="mt-2 text-gray-600">Configure the single deal shown on the homepage. Select the products that receive the discount.</p>
      <DealForm products={products} initial={deal ? {
        title: deal.title, description: deal.description, discountPercent: deal.discountPercent,
        startsAt: toLocalInput(deal.startsAt), endsAt: toLocalInput(deal.endsAt), isActive: deal.isActive,
        productIds: deal.products.map((p) => p.productId),
      } : undefined} />
    </div>
  </main>;
}
