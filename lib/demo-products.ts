"use client";

import { useEffect, useState } from "react";

export type DemoProduct = {
  id: string;
  name: string;
  description?: string | null;
  image?: string;
  basePrice: number;
  category?: string;
};

export type DemoProductOverride = Partial<
  Pick<DemoProduct, "name" | "description" | "image" | "basePrice">
>;

const STORAGE_KEY = "coffeemium-demo-product-overrides";
const DEMO_UPDATED_EVENT = "coffeemium-demo-updated";

function readOverrides(): Record<string, DemoProductOverride> {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getDemoProductOverride(productId: string): DemoProductOverride {
  return readOverrides()[productId] ?? {};
}

function notifyDemoUpdated() {
  window.dispatchEvent(new Event(DEMO_UPDATED_EVENT));
}

export function saveDemoProductOverride(
  productId: string,
  override: DemoProductOverride
) {
  const overrides = readOverrides();
  overrides[productId] = override;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  notifyDemoUpdated();
}

export function resetDemoProducts() {
  localStorage.removeItem(STORAGE_KEY);
  notifyDemoUpdated();
}

export function useDemoProduct<T extends DemoProduct>(product: T): T {
  const [override, setOverride] = useState<DemoProductOverride>({});

  useEffect(() => {
    const sync = () => setOverride(readOverrides()[product.id] ?? {});
    sync();
    window.addEventListener(DEMO_UPDATED_EVENT, sync);
    return () => window.removeEventListener(DEMO_UPDATED_EVENT, sync);
  }, [product.id]);

  return { ...product, ...override } as T;
}

export function useDemoProducts<T extends DemoProduct>(products: T[]): T[] {
  const [overrides, setOverrides] = useState<Record<string, DemoProductOverride>>({});

  useEffect(() => {
    const sync = () => setOverrides(readOverrides());
    sync();
    window.addEventListener(DEMO_UPDATED_EVENT, sync);
    return () => window.removeEventListener(DEMO_UPDATED_EVENT, sync);
  }, []);

  return products.map((product) => ({
    ...product,
    ...(overrides[product.id] ?? {}),
  })) as T[];
}
