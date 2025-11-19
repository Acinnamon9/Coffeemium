"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 italic">
                "This coffee changed my morning routine. Absolutely exquisite!"
              </p>
              <p className="mt-4 font-semibold text-gray-800">
                - Coffee Lover 1
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 italic">
                "I've never tasted such fresh coffee. The aroma alone is worth
                it."
              </p>
              <p className="mt-4 font-semibold text-gray-800">
                - Discerning Palate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 italic">
                "Fast delivery and incredible quality. Highly recommend!"
              </p>
              <p className="mt-4 font-semibold text-gray-800">
                - Happy Customer
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Born from a passion for exceptional coffee, we source the finest
            beans from sustainable farms around the world. Each batch is roasted
            with precision and care, ensuring every cup delivers a remarkable
            experience. We believe in quality, transparency, and the simple joy
            of a perfect brew.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
