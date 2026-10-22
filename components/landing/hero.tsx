"use client";
import Link from "next/link";
import { ListOrdered, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[30rem] items-center justify-center overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: "url('/images/Coffee-beans-hero-background.jpeg')",
          filter: "blur(2px)",
        }}
      ></div>
      <div className="absolute inset-0 bg-[#2b211b]/55" />
      <div className="relative z-10 px-4 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#f4d9b8]">Freshly roasted coffee</p>
        <h1 className="mb-5 text-5xl font-bold tracking-tight sm:text-7xl">Brew Better Mornings.</h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl">
          Specialty beans, thoughtful roasts, and the right grind for your daily ritual.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/shop"
            className="hero-icon-action hero-icon-action--light group"
            aria-label="Shop All Coffees"
            aria-describedby="hero-shop-tooltip"
          >
            <ShoppingBag className="hero-icon-action__icon hero-icon-action__icon--shop" aria-hidden="true" />
            <span id="hero-shop-tooltip" role="tooltip" className="hero-icon-tooltip">
              Shop All Coffees
            </span>
          </Link>
          <Link
            href="#howitworks-heading"
            className="hero-icon-action hero-icon-action--outline group"
            aria-label="How it works"
            aria-describedby="hero-how-it-works-tooltip"
          >
            <ListOrdered className="hero-icon-action__icon hero-icon-action__icon--how-it-works" aria-hidden="true" />
            <span id="hero-how-it-works-tooltip" role="tooltip" className="hero-icon-tooltip">
              How it works
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
