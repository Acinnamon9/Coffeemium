import { originCards } from "@/lib/origin-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateStaticParams() {
  return originCards.map((card) => ({
    slug: card.slug,
  }));
}

export default function OriginDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);
  const origin = originCards.find((card) => card.slug === decodedSlug);

  if (!origin) {
    return <div>Origin not found</div>;
  }

  return (
    <section className="container mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-amber-800 text-3xl">
            {origin.title}
          </CardTitle>
          <CardDescription>Details about {origin.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{origin.description}</p>
        </CardContent>
      </Card>
    </section>
  );
}
