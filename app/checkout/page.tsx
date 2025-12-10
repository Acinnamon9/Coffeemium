import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/checkout-form";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure user exists in database (syncing Clerk user to local DB)
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    // If not found by ID, try email matching as fallback
    const email = user.emailAddresses[0]?.emailAddress;
    if (email) {
      dbUser = await prisma.user.findUnique({
        where: { email },
      });

      // If found by email but currently has a different ID (e.g. from old generic uuid),
      // we might want to update the ID to match Clerk's ID if possible,
      // but changing PK is hard. For now, we'll use the existing dbUser.
    }

    // If still no user, create one using Clerk ID
    if (!dbUser && email) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: email,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        },
      });
    }
  }

  if (!dbUser) {
    // Should typically not happen unless email is missing
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <CheckoutForm userId={dbUser.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
