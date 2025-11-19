import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Varieties() {
  return (
    <section id="varieties" className="bg-amber-50 py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-amber-900">Our Coffee Varieties</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center flex flex-col">
            <CardHeader>
              <CardTitle className="text-amber-800">Arabica</CardTitle>
            </CardHeader>
            <CardContent className="grow">
              <p>Known for its delicate aroma, complex flavor, and higher acidity.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" className="text-amber-700 border-amber-700 hover:bg-amber-50">Explore Arabica</Button>
            </CardFooter>
          </Card>
          <Card className="text-center flex flex-col">
            <CardHeader>
              <CardTitle className="text-amber-800">Robusta</CardTitle>
            </CardHeader>
            <CardContent className="grow">
              <p>Bold, strong flavor with a higher caffeine content and crema.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" className="text-amber-700 border-amber-700 hover:bg-amber-50">Explore Robusta</Button>
            </CardFooter>
          </Card>
          <Card className="text-center flex flex-col">
            <CardHeader>
              <CardTitle className="text-amber-800">Liberica</CardTitle>
            </CardHeader>
            <CardContent className="grow">
              <p>A rarer variety with a unique smoky, woody, and floral aroma.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" className="text-amber-700 border-amber-700 hover:bg-amber-50">Explore Liberica</Button>
            </CardFooter>
          </Card>
          <Card className="text-center flex flex-col">
            <CardHeader>
              <CardTitle className="text-amber-800">Excelsa</CardTitle>
            </CardHeader>
            <CardContent className="grow">
              <p>Distinctive tart and fruity notes, often used in blends for complexity.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" className="text-amber-700 border-amber-700 hover:bg-amber-50">Explore Excelsa</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}