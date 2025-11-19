import OriginCard from "./origin-card";
import { originCards } from "@/lib/origin-data";

export default function Origins() {
  return (
    <section id="origins" className="container mx-auto py-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-amber-900">
        Explore By Origin
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {originCards.map((card, index) => (
          <OriginCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
