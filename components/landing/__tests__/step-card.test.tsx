import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StepCard } from "@/components/landing/step-card";

const step = {
  id: 1,
  title: "Roast",
  description: "We freshly roast our beans to perfection.",
  image: "/images/how-it-works/Roast.529Z.png",
};

describe("StepCard", () => {
  it("renders image with alt text and semantic headings", () => {
    render(<StepCard step={step} />);

    const img = screen.getByAltText(/Roast/i);
    expect(img).toBeInTheDocument();

    const heading = screen.getByRole("heading", { name: /1. Roast/i });
    expect(heading).toBeInTheDocument();

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-labelledby");
    expect(article).toHaveAttribute("aria-describedby");
  });
});
