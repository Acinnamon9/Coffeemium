import FeaturedCoffees from "@/components/landing/featured-coffees";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import ShopNowCta from "@/components/landing/shop-now-cta";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="grow">
        <Hero />
        <FeaturedCoffees />
        <HowItWorks />
        <Testimonials />
        <ShopNowCta />
      </main>
      <Footer />
    </div>
  );
}
