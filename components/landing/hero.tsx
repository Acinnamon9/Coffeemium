"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative h-96 flex items-center justify-center text-white mt-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: "url('/images/Coffee-beans-hero-background.jpeg')",
          filter: "blur(6px)", // Ah, the artistic touch
        }}
      ></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Brew Better Mornings.</h1>
        <p className="text-xl font-serif mb-8">
          Start your day right with exceptional coffee, delivered straight to
          your door.
        </p>
        <Button
          onClick={() => router.push("/shop")}
          className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-8 py-3 rounded-full text-lg font-semibold"
        >
          Shop All Coffees
        </Button>
      </div>
    </section>
  );
}
