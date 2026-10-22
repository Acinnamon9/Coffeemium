"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
}

export default function DealCountdown({ startsAt, endsAt, basePrice, discountPercent, productId }: { startsAt: string; endsAt: string; basePrice: number; discountPercent: number; productId: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  if (now === null) return <div className="mt-6 h-28" aria-hidden="true" />;
  const isExpired = now >= new Date(endsAt).getTime();
  const isUpcoming = now < new Date(startsAt).getTime();
  const [days, hours, minutes, seconds] = parts((isUpcoming ? new Date(startsAt).getTime() : new Date(endsAt).getTime()) - now);
  const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  return <div className="mt-6" aria-live="polite">
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold">{money(isExpired ? basePrice : basePrice * (1 - discountPercent / 100))}</span>
      {!isExpired && <span className="text-lg text-white/60 line-through">{money(basePrice)}</span>}
      <span className="text-sm text-[#f4d9b8]">per pack</span>
    </div>
    <p className="text-sm text-white/70">{isExpired ? "This offer has ended" : isUpcoming ? "Offer starts in" : "Offer ends in"}</p>
    {isExpired ? <p className="mt-1 text-xl font-bold">Expired</p> : <div className="mt-2 flex gap-2 sm:gap-3" aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`}>
      {[[days, "Days"], [hours, "Hours"], [minutes, "Mins"], [seconds, "Secs"]].map(([value, label]) => <div key={label} className="min-w-14 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center"><span className="block text-xl font-bold tabular-nums">{String(value).padStart(2, "0")}</span><span className="text-[10px] uppercase tracking-wider text-white/70">{label}</span></div>)}
    </div>}
    <a href={`/products/${productId}`} className={`mt-7 inline-flex w-fit rounded-full px-6 py-3 font-semibold transition ${isExpired || isUpcoming ? "pointer-events-none bg-white/20 text-white/50" : "bg-[#f4d9b8] text-[#3b281e] hover:bg-white"}`} aria-disabled={isExpired || isUpcoming}>
      {isExpired ? "Deal ended" : isUpcoming ? "Shop when it starts" : "Shop the deal"}
    </a>
  </div>;
}
