import { Compass, ShieldCheck, Sparkles, Waves } from "lucide-react";

import { BrowseByHotelType } from "@/components/BrowseByHotelType";
import { FeaturedHotels } from "@/components/FeaturedHotels";
import { Hero } from "@/components/Hero";
import { HomesGuestsLove } from "@/components/HomesGuestsLove";
import { TrendingDestinations } from "@/components/TrendingDestinations";

const highlights = [
  {
    icon: Compass,
    title: "Search that feels guided",
    description:
      "Fewer dead ends, clearer choices, and filters that help instead of overwhelm.",
  },
  {
    icon: Sparkles,
    title: "Editorial stay discovery",
    description:
      "A warmer visual system built to make destinations and hotels feel desirable instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Booking with confidence",
    description:
      "Cleaner flows, stronger hierarchy, and obvious next actions at every step.",
  },
  {
    icon: Waves,
    title: "Calmer travel planning",
    description:
      "Spacing, motion, and content structure tuned to reduce friction across the experience.",
  },
];

export default function HomePage() {
  return (
    <main className="pb-16">
      <Hero />

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="container-shell grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="surface-panel p-6">
                <div className="bg-primary/12 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-heading mt-5 text-3xl leading-none font-semibold">
                  {item.title}
                </h2>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="container-shell">
          <BrowseByHotelType />
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="container-shell">
          <TrendingDestinations />
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="container-shell">
          <HomesGuestsLove />
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="container-shell">
          <FeaturedHotels />
        </div>
      </section>
    </main>
  );
}
