import { SignUp } from "@clerk/nextjs";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf8f3]"><Header /><main className="flex grow items-center justify-center px-4 py-16"><div className="w-full max-w-md"><div className="mb-8 text-center"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6b46]">Start your ritual</p><h1 className="text-4xl font-bold text-[#3b281e]">Create your account</h1><p className="mt-3 text-gray-500">Your saved coffees and cart will be ready whenever you are.</p></div><SignUp routing="path" path="/register" signInUrl="/login" /></div></main><Footer /></div>
  );
}
