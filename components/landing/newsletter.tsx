import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="container mx-auto text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-8 text-amber-900">Stay in the Loop</h2>
        <p className="text-lg text-gray-700 mb-8">
          Get 10% off your first order and be the first to know about new arrivals, special offers, and more.
        </p>
        <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
          <Input type="email" placeholder="Enter your email" />
          <Button type="submit" className="bg-amber-800 text-white hover:bg-amber-700">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}