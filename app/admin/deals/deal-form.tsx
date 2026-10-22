"use client";

import { useEffect, useState } from "react";
import { saveFeaturedDeal } from "@/app/actions/deals";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; image: string };
type Initial = { title: string; description: string; discountPercent: number; startsAt: string; endsAt: string; isActive: boolean; productIds: string[] };

export function DealForm({ products, initial }: { products: Product[]; initial?: Initial }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    for (const [key, value] of [["startsAtLocal", initial?.startsAt], ["endsAtLocal", initial?.endsAt]] as const) {
      const field = document.querySelector<HTMLInputElement>(`input[name="${key}"]`);
      if (field && value) {
        const date = new Date(value);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        field.value = local.toISOString().slice(0, 16);
      }
    }
  }, [initial?.startsAt, initial?.endsAt]);
  async function submit(formData: FormData) {
    setBusy(true); setMessage("");
    try {
      for (const key of ["startsAt", "endsAt"]) {
        const field = document.querySelector<HTMLInputElement>(`input[name="${key}Local"]`);
        if (!field?.value) throw new Error("Choose both a start and end time.");
        formData.set(key, new Date(field.value).toISOString());
      }
      await saveFeaturedDeal(formData);
      setMessage("Deal saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the deal.");
    } finally { setBusy(false); }
  }
  return <form action={submit} className="mt-8 space-y-6 rounded-2xl border border-[#eadfd3] bg-white p-6 shadow-sm">
    <label className="block text-sm font-medium">Deal title<input name="title" required maxLength={100} defaultValue={initial?.title ?? "Weekend Roast Sale"} className="mt-1 w-full rounded-md border px-3 py-2" /></label>
    <label className="block text-sm font-medium">Description<textarea name="description" maxLength={300} defaultValue={initial?.description} className="mt-1 w-full rounded-md border px-3 py-2" rows={2} placeholder="Save on selected blends" /></label>
    <label className="block text-sm font-medium">Discount (%)<input name="discountPercent" type="number" min="1" max="90" required defaultValue={initial?.discountPercent ?? 20} className="mt-1 w-32 rounded-md border px-3 py-2" /></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Starts (your local time)<input name="startsAtLocal" type="datetime-local" required defaultValue={initial?.startsAt.slice(0, 16)} className="mt-1 w-full rounded-md border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Ends (your local time)<input name="endsAtLocal" type="datetime-local" required defaultValue={initial?.endsAt.slice(0, 16)} className="mt-1 w-full rounded-md border px-3 py-2" /></label>
    </div>
    <fieldset><legend className="mb-2 text-sm font-semibold">Eligible products</legend><div className="grid gap-2 sm:grid-cols-2">
      {products.map((product) => <label key={product.id} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><input type="checkbox" name="productIds" value={product.id} defaultChecked={initial?.productIds.includes(product.id)} />{product.name}</label>)}
    </div></fieldset>
    <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="isActive" defaultChecked={initial?.isActive} /> Active (deal still follows its start/end times)</label>
    <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save deal"}</Button>
    {message && <p role="status" className="text-sm text-[#6b4630]">{message}</p>}
  </form>;
}
