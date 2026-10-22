"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const ShopNowCta = () => {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Ready for a Fresh Brew?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Explore our exquisite selection of freshly roasted coffees.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link href="/shop">Shop Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
            <Link href="/demo">Make this your brand</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopNowCta;
