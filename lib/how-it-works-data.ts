export interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 1,
    title: "Roast",
    description:
      "We freshly roast our beans to perfection, ensuring optimal flavor.",
    image: "/images/how-it-works/Roast.529Z.png",
  },
  {
    id: 2,
    title: "Grind",
    description:
      "Beans are ground to your specification, from coarse French Press to fine Espresso.",
    image: "/images/how-it-works/Grind.448Z.png",
  },
  {
    id: 3,
    title: "Brew",
    description:
      "Prepare your coffee using your preferred method for a delightful cup.",
    image: "/images/how-it-works/Brew.211Z.png",
  },
  {
    id: 4,
    title: "Enjoy",
    description:
      "Savor the rich aromas and flavors of your freshly brewed coffee.",
    image: "/images/how-it-works/Enjoy.459Z.png",
  },
];
