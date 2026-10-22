"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-full bg-[#fff7ed] px-8 py-3 text-lg font-semibold text-[#3b281e] hover:bg-white">
            <Link href="/shop">Shop All Coffees</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/60 bg-white/10 px-8 py-3 text-lg font-semibold text-white hover:bg-white/20 hover:text-white">
            <Link href="#howitworks-heading">How it works</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-[#f4d9b8]/70 bg-[#f4d9b8]/10 px-8 py-3 text-lg font-semibold text-[#f4d9b8] hover:bg-[#f4d9b8]/20 hover:text-[#f4d9b8]">
            <Link href="/demo">Customize this demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
