import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OriginCardProps } from "@/lib/origin-data";

export default function OriginCard({
  title,
  description,
  slug,
  price,
}: OriginCardProps) {
  return (
    <Card className="text-center flex flex-col">
      <CardHeader>
        <CardTitle className="text-amber-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <p>{description}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="flex items-center space-x-2">
          <Link href={`/products/${slug}-coffee`}>
            <Button
              variant="outline"
              className="text-amber-700 border-amber-700 hover:bg-amber-50"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
