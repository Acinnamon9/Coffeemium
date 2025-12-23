import FeaturedCoffees from "@/components/landing/featured-coffees";
import FeaturedCoffeesSkeleton from "@/components/landing/featured-coffees-skeleton";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import ShopNowCta from "@/components/landing/shop-now-cta";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Footer from "@/components/landing/footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow">
        <Hero />
        <Suspense fallback={<FeaturedCoffeesSkeleton />}>
          <FeaturedCoffees />
        </Suspense>
        <HowItWorks />
        <Testimonials />
        <ShopNowCta />
      </main>
      <Footer />
    </div>
  );
}
