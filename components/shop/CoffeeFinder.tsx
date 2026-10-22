"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDemoProducts, type DemoProduct } from "@/lib/demo-products";

type Product = DemoProduct & {
  detail?: { origin?: string | null; tastingNotes?: string[]; fullDescription?: string } | null;
  productRoasts?: { roast?: { name?: string | null } | null }[];
};

const flavorTokens: Record<string, string[]> = {
  chocolate: ["chocolate", "cocoa", "brownie", "mocha"],
  fruity: ["berry", "cherry", "citrus", "lemon", "orange", "grapefruit", "fruit", "currant"],
  floral: ["floral", "jasmine", "bergamot", "tea-like"],
  nutty: ["nut", "walnut", "hazelnut", "almond", "caramel"],
  sweet: ["sweet", "honey", "vanilla", "sugar", "toffee"],
  bold: ["smoky", "earthy", "spice", "bold", "strong", "dark"],
};
const brewTokens: Record<string, string[]> = {
  espresso: ["espresso", "espresso machine", "cappuccino"],
  pourOver: ["pour-over", "pour over", "v60", "chemex", "drip", "aeropress"],
  frenchPress: ["french press", "cold brew"],
  moka: ["moka", "stovetop"],
  instant: ["instant", "freeze-dried"],
};
const strengthRoast: Record<string, string[]> = {
  light: ["light", "blonde"], medium: ["medium"], dark: ["dark", "strong"],
};
const grindByBrewer: Record<string, string> = {
  espresso: "Espresso Machine Grind", pourOver: "Pour Over Grind", frenchPress: "French Press Grind", moka: "Moka Pot Grind",
};

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export default function CoffeeFinder() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [flavor, setFlavor] = useState("any");
  const [brewer, setBrewer] = useState("any");
  const [strength, setStrength] = useState("any");
  const [submitted, setSubmitted] = useState(false);
  const products = useDemoProducts(rawProducts);

  useEffect(() => {
    let active = true;
    fetch("/api/products").then((response) => response.json()).then((data) => {
      if (active && Array.isArray(data.products)) setRawProducts(data.products);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const matches = useMemo(() => products.map((product) => {
    const roastNames = product.productRoasts?.map((item) => item.roast?.name ?? "").filter(Boolean) ?? [];
    const notes = product.detail?.tastingNotes?.join(" ") || product.detail?.fullDescription || "";
    const bestFor = product.detail?.fullDescription?.match(/Best For:\s*([^\n*]+)/i)?.[1] ?? "";
    const haystack = `${notes} ${product.name} ${product.description ?? ""}`.toLowerCase();
    const uses = `${bestFor} ${product.name} ${product.description ?? ""}`.toLowerCase();
    const score = (flavor === "any" || includesAny(haystack, flavorTokens[flavor] ?? [flavor]) ? 1 : 0)
      + (brewer === "any" || includesAny(uses, brewTokens[brewer] ?? [brewer]) ? 1 : 0)
      + (strength === "any" || includesAny(`${roastNames.join(" ")} ${product.detail?.fullDescription ?? ""}`.toLowerCase(), strengthRoast[strength] ?? [strength]) ? 1 : 0);
    const suggestedRoast = roastNames.find((name) => strength === "any" || includesAny(name.toLowerCase(), strengthRoast[strength] ?? [strength])) ?? roastNames[0];
    const suggestedGrind = grindByBrewer[brewer];
    return { product, score, suggestedRoast, suggestedGrind, notes: product.detail?.tastingNotes?.slice(0, 3) ?? [] };
  }).sort((a, b) => b.score - a.score).slice(0, 3), [products, flavor, brewer, strength]);

  return <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-9" aria-labelledby="coffee-finder-title">
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b46]">A quick coffee match</p><h2 id="coffee-finder-title" className="mt-2 text-2xl font-bold text-[#3b281e] sm:text-3xl">Find Your Perfect Coffee</h2><p className="mt-2 text-sm leading-6 text-[#75675d]">Choose a flavor, your brewer, and the strength you enjoy. We’ll match those preferences to the coffees in the catalog.</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-medium text-[#3b281e]">Flavor<select value={flavor} onChange={(event) => setFlavor(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#eadfd3] bg-white px-3"><option value="any">Surprise me</option><option value="chocolate">Chocolate</option><option value="fruity">Fruity</option><option value="floral">Floral</option><option value="nutty">Nutty</option><option value="sweet">Sweet</option><option value="bold">Bold &amp; earthy</option></select></label>
        <label className="text-sm font-medium text-[#3b281e]">Brewer<select value={brewer} onChange={(event) => setBrewer(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#eadfd3] bg-white px-3"><option value="any">Any brewer</option><option value="espresso">Espresso</option><option value="pourOver">Pour over / drip</option><option value="frenchPress">French press / cold brew</option><option value="moka">Moka pot</option><option value="instant">Instant</option></select></label>
        <label className="text-sm font-medium text-[#3b281e]">Strength<select value={strength} onChange={(event) => setStrength(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#eadfd3] bg-white px-3"><option value="any">Any strength</option><option value="light">Light</option><option value="medium">Medium</option><option value="dark">Dark</option></select></label>
      </div>
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[#82756c]">Recommendations use catalog tasting notes, brewing details, and roast options.</p><button type="button" onClick={() => setSubmitted(true)} className="rounded-full bg-[#3b281e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#563b2b]">Show my matches</button></div>
    {submitted && <div className="mt-6 border-t border-[#eadfd3] pt-6" aria-live="polite">
      {products.length === 0 ? <p className="rounded-xl bg-[#f8f3ee] p-4 text-sm text-[#6b574a]">We couldn’t load coffee details just now. Browse the full <Link href="/shop" className="font-semibold underline">coffee catalog</Link> and explore available options.</p> : matches[0]?.score === 0 ? <p className="rounded-xl bg-[#f8f3ee] p-4 text-sm text-[#6b574a]">We don’t have enough matching details to personalize that combination yet. <Link href="/shop" className="font-semibold underline">Browse all coffees</Link>.</p> : <div className="grid gap-4 md:grid-cols-3">{matches.filter((match) => match.score > 0).map(({ product, suggestedRoast, suggestedGrind, notes }) => <article key={product.id} className="overflow-hidden rounded-2xl border border-[#eadfd3] bg-[#fcfaf7]">
        {product.image && <Image src={product.image} alt={product.name} width={480} height={320} className="h-40 w-full object-cover" />}
        <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#9a6b46]">Your catalog match</p><h3 className="mt-1 font-semibold text-[#3b281e]">{product.name.replace(/\s*\(\d+\s*g\)\s*$/i, "")}</h3>
          {notes.length > 0 && <p className="mt-2 text-sm text-[#75675d]">{notes.join(" · ")}</p>}
          <p className="mt-3 text-sm text-[#6b574a]">{suggestedRoast ? `${suggestedRoast} roast` : "Choose from available roast options"}{suggestedGrind ? ` · ${suggestedGrind}` : ""}</p>
          <Link href={`/products/${product.id}`} className="mt-4 inline-flex rounded-full border border-[#8b5e3c] px-4 py-2 text-sm font-semibold text-[#704b32] hover:bg-[#f2e8dc]">Explore coffee</Link>
        </div>
      </article>)}</div>}
    </div>}
  </section>;
}
