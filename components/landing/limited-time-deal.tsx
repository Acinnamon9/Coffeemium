import { getFeaturedDealForHomepage } from "@/lib/deals";
import DealCountdown from "./deal-countdown";

export default async function LimitedTimeDeal() {
  const deal = await getFeaturedDealForHomepage();
  if (!deal?.isActive || deal.products.length === 0) return null;
  const product = deal.products[0].product;
  return <section className="bg-[#f4ede5] px-4 py-14 sm:py-20" aria-labelledby="limited-deal-title">
    <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-[#3b281e] text-white shadow-xl md:grid-cols-2">
      <div className="relative min-h-[20rem] md:min-h-[30rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        <span className="absolute left-6 top-6 rounded-full bg-[#e57f3a] px-4 py-2 text-sm font-bold">{deal.discountPercent}% OFF</span>
        <p className="absolute bottom-6 left-6 text-xl font-semibold">{product.name}</p>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f4d9b8]">Limited-time deal</p>
        <h2 id="limited-deal-title" className="mt-3 text-4xl font-bold sm:text-5xl">{deal.title}</h2>
        <p className="mt-4 max-w-lg text-lg text-white/80">{deal.description || `Save ${deal.discountPercent}% on selected coffees.`}</p>
        <DealCountdown startsAt={deal.startsAt.toISOString()} endsAt={deal.endsAt.toISOString()} basePrice={product.basePrice} discountPercent={deal.discountPercent} productId={product.id} />
      </div>
    </div>
  </section>;
}
