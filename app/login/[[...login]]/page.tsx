import { SignIn } from "@clerk/nextjs";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf8f3]">
      <Header />
      <main className="flex grow items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b46]">
              Welcome back
            </p>
            <h1 className="text-4xl font-bold text-[#3b281e]">
              Sign in to Coffeemium
            </h1>
            <p className="mt-3 text-gray-500">
              Save your coffee preferences and keep your cart synced.
            </p>
          </div>
          <SignIn routing="path" path="/login" signUpUrl="/register" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
