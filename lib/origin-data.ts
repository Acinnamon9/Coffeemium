export interface OriginCardProps {
  title: string;
  description: string;
  slug: string;
  price?: number;
}

export const originCards: OriginCardProps[] = [
  {
    title: "Ethiopian Yirgacheffe",
    description:
      "Bright and floral with notes of citrus and berry. A truly captivating experience.",
    slug: "ethiopian-yirgacheffe",
    price: 15.99,
  },
  {
    title: "Colombian Supremo",
    description:
      "Rich, well-balanced, and smooth with a hint of nutty sweetness. A classic favorite.",
    slug: "colombian-supremo",
    price: 14.5,
  },
  {
    title: "Brazilian Santos",
    description:
      "Low acidity, heavy body, and a pronounced chocolatey flavor. Perfect for espresso.",
    slug: "brazilian-santos",
    price: 13.75,
  },
];
