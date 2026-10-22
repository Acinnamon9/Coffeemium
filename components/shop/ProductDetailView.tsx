"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Heart, MapPin, Star, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import ProductDetailActions from "@/components/shop/ProductDetailActions";
import { useDemoProduct, type DemoProduct } from "@/lib/demo-products";
import { useCart } from "@/hooks/useCart";
import { formatPackageGrams, getAvailablePackageSizes, getBasePackageGrams } from "@/lib/package-size";

type ProductDetail = DemoProduct & {
  detail?: {
    fullDescription: string;
    origin?: string | null;
    tastingNotes?: string[];
    body?: number | null;
    acidity?: number | null;
    sweetness?: number | null;
    bitterness?: number | null;
    galleryImages?: string[];
    roastProfiles?: unknown;
  } | null;
  productRoasts: { roast: { id: string; name: string; defaultMultiplier?: number | null } }[];
};
type GrindOption = { id: string; name: string; extraCost: number };
type RelatedProduct = Pick<DemoProduct, "id" | "name" | "description" | "image" | "basePrice" | "category">;
const sharedGallery = [
  "/images/product-gallery/coffee-bag-still-life.png",
  "/images/product-gallery/roasted-beans-closeup.png",
  "/images/product-gallery/pour-over-cup.png",
  "/images/product-gallery/coffee-cherries-origin.png",
];
type RoastPresentation = { tastingNotes?: string[]; recommendedBrew?: string; image?: string; body?: number; acidity?: number; sweetness?: number; bitterness?: number };
const brewMethods = {
  "Pour Over": { grind: "Medium-fine", temperature: "93°C", ratio: "1:16", time: "2:45–3:15" },
  "French Press": { grind: "Coarse", temperature: "93°C", ratio: "1:15", time: "4 minutes" },
  Espresso: { grind: "Fine", temperature: "92–94°C", ratio: "1:2", time: "25–30 seconds" },
  "Moka Pot": { grind: "Fine-medium", temperature: "Hot water in base", ratio: "1:10", time: "4–5 minutes" },
  "Cold Brew": { grind: "Coarse", temperature: "Room temperature", ratio: "1:8", time: "12–16 hours" },
} as const;
type BrewMethod = keyof typeof brewMethods;

function detailValue(description: string, key: string) {
  const line = description.split("\n").find((entry) => entry.match(new RegExp(`^\\s*\\*?\\s*${key}:`, "i")));
  return line?.replace(new RegExp(`^\\s*\\*?\\s*${key}:\\s*`, "i"), "").trim() ?? "";
}

function ProfileBars({ values }: { values: { label: string; value: number }[] }) {
  return <div className="grid gap-4 sm:grid-cols-2">{values.map(({ label, value }) => <div key={label}>
    <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="font-medium">{value}/5</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-[#efe5db]" aria-label={`${label}: ${value} out of 5`}><div className="h-full rounded-full bg-[#9a6b46]" style={{ width: `${value * 20}%` }} /></div>
  </div>)}</div>;
}

function subscribeWishlist(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("coffeemium-wishlist-updated", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("coffeemium-wishlist-updated", onChange);
  };
}

function wishlistSnapshot(productId: string) {
  try {
    const favorites: string[] = JSON.parse(localStorage.getItem("coffeemium-wishlist") ?? "[]");
    return favorites.includes(productId);
  } catch { return false; }
}

export default function ProductDetailView({ product, grindOptions, relatedProducts }: {
  product: ProductDetail;
  grindOptions: GrindOption[];
  relatedProducts: RelatedProduct[];
}) {
  const displayed = useDemoProduct(product);
  const { addBundleToCart } = useCart();
  const baseGrams = getBasePackageGrams(displayed.name);
  const packageSizes = getAvailablePackageSizes(baseGrams);
  const instant = displayed.category === "instant";
  const preGround = displayed.category === "grinds";
  const roastApplicable = !instant && !preGround && displayed.productRoasts.length > 0;
  const grindApplicable = !instant && !preGround && grindOptions.length > 0;
  const [photo, setPhoto] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [packageGrams, setPackageGrams] = useState(baseGrams);
  const [roastId, setRoastId] = useState(product.productRoasts[0]?.roast.id ?? "");
  const [grindId, setGrindId] = useState(grindOptions[0]?.id ?? "");
  const [purchaseMode, setPurchaseMode] = useState<"once" | "subscribe">("once");
  const [frequency, setFrequency] = useState(2);
  const saved = useSyncExternalStore(
    subscribeWishlist,
    () => wishlistSnapshot(displayed.id),
    () => false
  );
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [brewMethod, setBrewMethod] = useState<BrewMethod>("Pour Over");
  const selectedRoast = displayed.productRoasts.find(({ roast }) => roast.id === roastId)?.roast;
  const selectedGrind = grindOptions.find((option) => option.id === grindId);
  const roastProfiles = (displayed.detail?.roastProfiles ?? {}) as Record<string, RoastPresentation>;
  const roastPresentation = selectedRoast ? roastProfiles[selectedRoast.name] : undefined;
  const roastLevel = selectedRoast?.name ?? (detailValue(displayed.detail?.fullDescription ?? "", "Roast Level") || "Medium");
  const defaultRecommendedBrew: BrewMethod = roastLevel.toLowerCase().includes("dark") ? "French Press" : roastLevel.toLowerCase().includes("light") ? "Pour Over" : "Espresso";
  const recommendedBrew = Object.hasOwn(brewMethods, roastPresentation?.recommendedBrew ?? "")
    ? roastPresentation!.recommendedBrew as BrewMethod
    : defaultRecommendedBrew;

  const detail = displayed.detail?.fullDescription ?? "";
  const origin = displayed.detail?.origin || detailValue(detail, "Origin");
  const legacyNotes = detailValue(detail, "Tasting Notes") || detailValue(detail, "Flavor Profile") || detailValue(detail, "Flavor");
  const catalogNotes = displayed.detail?.tastingNotes?.length ? displayed.detail.tastingNotes : legacyNotes.split(/[,·]/).map((note) => note.trim().replace(/[.*]/g, "")).filter(Boolean);
  const tastingNotes = (roastPresentation?.tastingNotes?.length ? roastPresentation.tastingNotes : catalogNotes).slice(0, 4);
  const profile = ([
    { label: "Body", value: roastPresentation?.body ?? displayed.detail?.body },
    { label: "Acidity", value: roastPresentation?.acidity ?? displayed.detail?.acidity },
    { label: "Sweetness", value: roastPresentation?.sweetness ?? displayed.detail?.sweetness },
    { label: "Bitterness", value: roastPresentation?.bitterness ?? displayed.detail?.bitterness },
  ] as { label: string; value: number | null | undefined }[]).filter((item): item is { label: string; value: number } => typeof item.value === "number" && item.value >= 1 && item.value <= 5);
  const packageMultiplier = packageGrams / baseGrams;
  const unitPrice = displayed.basePrice * packageMultiplier * (roastApplicable ? selectedRoast?.defaultMultiplier ?? 1 : 1) + (grindApplicable ? selectedGrind?.extraCost ?? 0 : 0);
  const price = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
  const productTitle = displayed.name.replace(/\s*\(\d+\s*g\)\s*$/i, "");
  const related = relatedProducts.find((item) => item.category === displayed.category) ?? relatedProducts[0];
  const bundleTotal = displayed.basePrice + (related?.basePrice ?? 0);
  const gallery = [roastPresentation?.image || displayed.image || "/images/Logo/Coffeemium.png", ...(displayed.detail?.galleryImages?.length ? displayed.detail.galleryImages : sharedGallery)];
  const photos = ["Coffee packaging", "Coffee bag still life", "Roasted coffee beans", "A freshly brewed cup", "Coffee growing environment"];

  function toggleWishlist() {
    try {
      const favorites: string[] = JSON.parse(localStorage.getItem("coffeemium-wishlist") ?? "[]");
      const next = saved ? favorites.filter((id) => id !== displayed.id) : [...new Set([...favorites, displayed.id])];
      localStorage.setItem("coffeemium-wishlist", JSON.stringify(next));
      window.dispatchEvent(new Event("coffeemium-wishlist-updated"));
      toast.success(saved ? "Removed from your saved coffees." : "Saved to your wishlist.");
    } catch { toast.error("Your wishlist could not be saved in this browser."); }
  }

  function checkDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeliveryMessage(/^[1-9]\d{5}$/.test(pincode) ? `Demo estimate: delivery to ${pincode} in 3–5 business days.` : "Enter a valid 6-digit Indian PIN code.");
  }

  async function addPairing() {
    if (!related) return;
    const result = await addBundleToCart([
      { id: displayed.id, name: displayed.name, basePrice: displayed.basePrice, image: displayed.image },
      { id: related.id, name: related.name, basePrice: related.basePrice, image: related.image },
    ]);
    if (result.success) toast.success("Coffee pairing added with a demo 10% saving.");
    else toast.error(result.error ?? "Could not add this pairing.");
  }

  return <>
    <Link href="/shop" className="mb-6 inline-block text-sm font-medium text-[#8b5e3c] hover:underline">← Back to shop</Link>
    <section className="grid overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm lg:grid-cols-[1.08fr_0.92fr]">
      <div className="bg-[#f4ede5] p-4 sm:p-7">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eee2d5]">
          <Image src={gallery[photo] ?? gallery[0]} alt={`${productTitle} — ${photos[photo] ?? "Coffee photo"}`} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" priority />
          <button type="button" onClick={() => setZoomed(true)} className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3b281e] shadow" aria-label="Zoom product image"><ZoomIn size={17} /> Zoom</button>
          <span className="absolute left-3 top-3 rounded-full bg-[#3b281e]/80 px-3 py-1 text-xs font-medium text-white">Illustrative imagery</span>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">{gallery.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setPhoto(index)} aria-label={`Show ${photos[index] ?? `photo ${index + 1}`}`} aria-pressed={photo === index} className={`aspect-square overflow-hidden rounded-xl border-2 ${photo === index ? "border-[#8b5e3c]" : "border-transparent"}`}>
          <Image src={src} alt="" width={120} height={120} className="h-full w-full object-cover" />
        </button>)}</div>
      </div>

      <div className="flex flex-col p-6 sm:p-9 lg:p-10">
        <div className="flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b46]">{displayed.category?.replaceAll("-", " ") ?? "Freshly roasted"}</p><h1 className="text-3xl font-bold tracking-tight text-[#3b281e] sm:text-4xl">{productTitle}</h1><p className="mt-2 text-sm text-[#74665d]">{origin ? `${origin} · ` : ""}Freshly roasted</p></div>
          <button type="button" onClick={toggleWishlist} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved} className={`rounded-full border p-3 ${saved ? "border-[#8b5e3c] bg-[#f2e8dc] text-[#8b5e3c]" : "border-[#eadfd3] text-[#6b574a] hover:bg-[#f8f3ee]"}`}><Heart size={20} fill={saved ? "currentColor" : "none"} /></button>
        </div>
        <p className="mt-4 leading-7 text-[#6b625c]">{displayed.description}</p>

        {roastApplicable && <fieldset className="mt-6"><legend className="mb-2 text-sm font-semibold text-[#3b281e]">Choose your roast</legend><div className="grid grid-cols-3 gap-2">{displayed.productRoasts.map(({ roast }) => <button type="button" key={roast.id} onClick={() => { setRoastId(roast.id); setPhoto(0); }} aria-pressed={roastId === roast.id} className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${roastId === roast.id ? "border-[#8b5e3c] bg-[#f5ece3] text-[#3b281e]" : "border-[#eadfd3] text-[#6b574a]"}`}>{roast.name}</button>)}</div></fieldset>}
        {grindApplicable && <label className="mt-5 block text-sm font-semibold text-[#3b281e]">Grind for your brewer<select value={grindId} onChange={(event) => setGrindId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#eadfd3] bg-white px-3 font-normal text-[#4b3a30]">{grindOptions.map((option) => <option key={option.id} value={option.id}>{option.name}{option.extraCost ? ` (+${price(option.extraCost)})` : ""}</option>)}</select></label>}
        {preGround && <p className="mt-5 rounded-xl bg-[#f8f3ee] p-3 text-sm text-[#6b574a]">Ground for its named brewing method. No additional grind selection needed.</p>}
        {instant && <p className="mt-5 rounded-xl bg-[#f8f3ee] p-3 text-sm text-[#6b574a]">Ready to brew. Roast and grind selections do not apply to instant coffee.</p>}

        <div className="mt-5"><p className="mb-2 text-sm font-semibold text-[#3b281e]">Pack size</p><div className="grid grid-cols-3 gap-2">{packageSizes.map((size) => <button key={size} type="button" onClick={() => setPackageGrams(size)} aria-pressed={packageGrams === size} className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${packageGrams === size ? "border-[#8b5e3c] bg-[#f5ece3] text-[#3b281e]" : "border-[#eadfd3] text-[#6b574a]"}`}>{formatPackageGrams(size)}</button>)}</div></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-3xl font-semibold text-[#3b281e]">{price(unitPrice)}</p><p className="text-xs text-[#82756c]">per {formatPackageGrams(packageGrams)}</p></div><div className="flex items-center rounded-full border border-[#eadfd3]"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-2 text-lg" aria-label="Decrease quantity">−</button><span aria-live="polite" className="min-w-8 text-center">{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="px-4 py-2 text-lg" aria-label="Increase quantity">+</button></div></div>
        <p className="mt-3 rounded-xl bg-[#f8f3ee] px-4 py-3 text-sm text-[#6b574a]">Your selection: {roastApplicable ? `${roastLevel} roast` : "Ready to brew"} · {selectedGrind?.name ?? (preGround ? "Pre-ground" : "Whole Bean")} · {formatPackageGrams(packageGrams)}</p>

        <div className="mt-5 rounded-2xl border border-[#eadfd3] p-4"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setPurchaseMode("once")} aria-pressed={purchaseMode === "once"} className={`rounded-xl px-3 py-2 text-sm font-semibold ${purchaseMode === "once" ? "bg-[#3b281e] text-white" : "bg-[#f8f3ee] text-[#5b493c]"}`}>One-time</button><button type="button" onClick={() => setPurchaseMode("subscribe")} aria-pressed={purchaseMode === "subscribe"} className={`rounded-xl px-3 py-2 text-sm font-semibold ${purchaseMode === "subscribe" ? "bg-[#3b281e] text-white" : "bg-[#f8f3ee] text-[#5b493c]"}`}>Subscribe &amp; save · demo</button></div>
          {purchaseMode === "subscribe" && <><div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm"><label htmlFor="delivery-frequency" className="text-[#6b574a]">Preview frequency</label><select id="delivery-frequency" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} className="rounded-lg border border-[#eadfd3] bg-white px-2 py-2 text-[#3b281e]">{[2, 3, 4].map((weeks) => <option key={weeks} value={weeks}>Every {weeks} weeks</option>)}</select><strong className="text-[#3b281e]">{price(unitPrice * 0.9)}</strong></div><p className="mt-2 text-xs leading-5 text-[#82756c]">10% demo savings preview. This does not schedule recurring orders; the cart action remains a one-time purchase.</p></>}
        </div>
        <div className="mt-5"><ProductDetailActions product={{ id: displayed.id, name: displayed.name, basePrice: displayed.basePrice, image: displayed.image ?? "" }} quantity={quantity} options={{ roastId: roastApplicable ? roastId : null, grindOptionId: grindApplicable ? grindId : null, packageGrams }} /></div>

        <form onSubmit={checkDelivery} className="mt-5 rounded-2xl bg-[#f8f3ee] p-4"><label htmlFor="product-pincode" className="flex items-center gap-2 text-sm font-semibold text-[#3b281e]"><MapPin size={16} /> Check delivery estimate</label><div className="mt-2 flex gap-2"><input id="product-pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))} placeholder="6-digit PIN code" className="min-w-0 flex-1 rounded-lg border border-[#eadfd3] px-3 py-2 text-sm" /><button className="rounded-lg bg-[#eadfd3] px-4 text-sm font-semibold text-[#3b281e]">Check</button></div><p aria-live="polite" className="mt-2 min-h-5 text-xs text-[#6b574a]">{deliveryMessage || "Demo estimate only; live courier serviceability is not checked."}</p></form>
      </div>
    </section>

    <section className="mt-12 grid gap-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-9 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b46]">Coffee profile</p><h2 className="mt-2 text-2xl font-bold text-[#3b281e]">Explore the character of your cup</h2><p className="mt-2 text-sm leading-6 text-[#75675d]">Product profile values appear when they’re available in the coffee details.</p>{profile.length > 0 ? <div className="mt-6"><ProfileBars values={profile} /></div> : <p className="mt-5 rounded-xl bg-[#f8f3ee] p-4 text-sm text-[#75675d]">Profile scores haven’t been added for this coffee yet.</p>}</div><div className="rounded-2xl bg-[#f8f3ee] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold text-[#3b281e]">Tasting notes</h3><span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#8b5e3c]">{roastLevel} roast</span></div>{tastingNotes.length ? <div className="mt-4 flex flex-wrap gap-2">{tastingNotes.map((note) => <span key={note} className="rounded-full border border-[#e8d8c8] bg-white px-3 py-2 text-sm text-[#624a39]">{note}</span>)}</div> : <p className="mt-4 text-sm text-[#75675d]">Tasting notes are not available yet.</p>}<div className="mt-6 border-t border-[#e7d9cc] pt-5"><p className="text-xs font-semibold uppercase tracking-wide text-[#9a6b46]">Brew suggestion · demo starting point</p><p className="mt-2 text-sm leading-6 text-[#5e4b3f]">Try {recommendedBrew} and adjust to taste.</p></div></div></section>

    <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div className="rounded-3xl bg-[#3b281e] p-7 text-white sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dbb995]">Brew it your way · demo guide</p><h2 className="mt-2 text-2xl font-bold">A better cup, step by step</h2><p className="mt-2 text-sm leading-6 text-[#eadfd3]">Starting points for popular brewers. Fine-tune to taste.</p><label className="mt-6 block text-sm font-medium">Brewing method<select value={brewMethod} onChange={(event) => setBrewMethod(event.target.value as BrewMethod)} className="mt-2 h-11 w-full rounded-xl border border-white/20 bg-[#523a2b] px-3 text-white">{Object.keys(brewMethods).map((method) => <option key={method}>{method}</option>)}</select></label><div className="mt-5 grid grid-cols-2 gap-3">{Object.entries(brewMethods[brewMethod]).map(([label, value]) => <div key={label} className="rounded-xl bg-white/10 p-3"><p className="text-xs capitalize text-[#dbb995]">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}</div></div>
      <div className="rounded-3xl border border-[#eadfd3] bg-white p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b46]">From origin to cup · illustrative demo</p><h2 className="mt-2 text-2xl font-bold text-[#3b281e]">A thoughtful journey in every brew</h2><div className="mt-7 space-y-5 border-l-2 border-[#e6d5c4] pl-5">{[["01", "Origin", origin ? `Catalog origin: ${origin}.` : "Origin details haven’t been added for this coffee yet."], ["02", "Harvest & process", "A general overview of the steps that shape a coffee’s character."], ["03", "Roast fresh", "Roast options are shown above; choose the profile that suits your cup."], ["04", "Brew at home", `Try ${selectedGrind?.name ?? brewMethod} and adjust to taste.`]].map(([number, title, copy]) => <div key={number} className="relative"><span className="absolute -left-[1.88rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#f2e8dc] text-xs font-bold text-[#704b32]">{number}</span><h3 className="font-semibold text-[#3b281e]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#75675d]">{copy}</p></div>)}</div><p className="mt-5 text-xs text-[#8a7b70]">Editorial details are illustrative demo copy, not farm-level sourcing claims.</p></div>
    </section>

    {related && <section className="mt-12 rounded-3xl border border-[#eadfd3] bg-[#f4ede5] p-6 sm:p-9"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b46]">Curated pairing · demo</p><h2 className="mt-2 text-2xl font-bold text-[#3b281e]">Enjoy these together</h2></div><p className="max-w-sm text-sm text-[#75675d]">A demo pairing with a 10% bundle saving.</p></div><div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">{[{ id: displayed.id, name: productTitle, image: displayed.image, basePrice: displayed.basePrice }, related].map((item) => <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-3">{item.image && <Image src={item.image} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-xl object-cover" />}<div><p className="font-semibold text-[#3b281e]">{item.name.replace(/\s*\(\d+\s*g\)\s*$/i, "")}</p><p className="text-sm text-[#75675d]">{price(item.basePrice)}</p></div></div>)}<span className="hidden text-2xl text-[#9a6b46] sm:block">+</span></div><div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4"><p className="text-sm text-[#6b574a]"><del className="mr-2 text-[#9c9188]">{price(bundleTotal)}</del><strong className="text-lg text-[#3b281e]">{price(bundleTotal * 0.9)}</strong><span className="ml-2 text-[#8b5e3c]">Save {price(bundleTotal * 0.1)}</span></p><button type="button" onClick={addPairing} className="rounded-full bg-[#3b281e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#563b2b]">Add demo pairing</button></div></section>}

    <section className="mt-12 rounded-3xl border border-[#eadfd3] bg-white p-6 sm:p-9"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b46]">Customer notes</p><h2 className="mt-2 text-2xl font-bold text-[#3b281e]">What coffee lovers might say</h2></div><span className="rounded-full bg-[#f2e8dc] px-3 py-1 text-xs font-semibold text-[#704b32]">Sample reviews · demo</span></div><div className="mt-6 grid gap-4 md:grid-cols-3">{[["A lovely start to the morning", "Aroma, balance, and a fresh cup make this an easy daily favorite."], ["Made for slow brewing", "The tasting notes open up beautifully when you take your time."], ["A thoughtful coffee gift", "A warm, comforting cup with a finish worth coming back to."]].map(([title, copy], index) => <article key={title} className="rounded-2xl bg-[#f8f3ee] p-5"><div className="flex gap-1 text-[#a8754f]" aria-label="5 out of 5 sample stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={15} fill="currentColor" />)}</div><h3 className="mt-3 font-semibold text-[#3b281e]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#75675d]">“{copy}”</p><p className="mt-4 text-xs font-medium text-[#8b5e3c]">Sample reviewer {index + 1} · Demo only</p></article>)}</div></section>

    {zoomed && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211710]/90 p-4" role="dialog" aria-modal="true" aria-label="Zoomed product photo" onKeyDown={(event) => { if (event.key === "Escape") setZoomed(false); }} tabIndex={-1}><button type="button" onClick={() => setZoomed(false)} className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3b281e]">Close</button><div className="relative aspect-square w-full max-w-3xl overflow-hidden rounded-2xl bg-[#f4ede5]"><Image src={gallery[photo] ?? gallery[0]} alt={`${productTitle} — ${photos[photo] ?? "Coffee photo"}`} fill sizes="90vw" className="object-contain" /></div></div>}
  </>;
}
