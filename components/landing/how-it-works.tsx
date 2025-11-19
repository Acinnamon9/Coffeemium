"use client";

import { howItWorksSteps } from "@/lib/how-it-works-data";
import { StepCard } from "./step-card";

const HowItWorks = () => {
  return (
    <section
      className="py-20 bg-gray-50"
      role="region"
      aria-labelledby="howitworks-heading"
    >
      <div className="container mx-auto px-4 text-center">
        <h2
          id="howitworks-heading"
          className="text-4xl font-semibold text-gray-900 mb-16"
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {howItWorksSteps.map((step) => (
            <div key={step.id} className="mx-3">
              <StepCard step={step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
