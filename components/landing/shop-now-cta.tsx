"use client";

import React from "react";
import { Button } from "../ui/button";

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
        <Button
          size="lg"
          className="text-lg px-8 py-4"
          onClick={() => (window.location.href = "/shop")}
        >
          Shop Now
        </Button>
      </div>
    </section>
  );
};

export default ShopNowCta;
