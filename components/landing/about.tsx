import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="container mx-auto py-16 px-4 text-center">
      <h2 className="text-4xl font-bold mb-8 text-amber-900">Our Passion for Coffee</h2>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
        At Coffee Roasters, we meticulously source the finest green coffee beans from sustainable farms worldwide.
        Our expert roasters then carefully craft each batch to bring out the unique flavors and aromas
        that make every cup an unforgettable experience. Taste the difference quality makes!
      </p>
      <Button className="bg-amber-800 text-white hover:bg-amber-700 px-8 py-3 rounded-full text-lg font-semibold">Learn More About Us</Button>
    </section>
  );
}