import { FeaturedHotels } from "@/components/FeaturedHotels";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-12 pb-12">
      <Hero />
      <div className="container mx-auto px-4 sm:px-6">
        <FeaturedHotels />
      </div>
    </main>
  );
}
