import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/checkout-form";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default async function CheckoutPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get user from database
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <CheckoutForm userId={user.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
