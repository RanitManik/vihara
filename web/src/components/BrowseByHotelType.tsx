"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const hotelTypeCards = [
  {
    title: "Boutique",
    description: "Small footprint, stronger identity, and memorable interiors.",
    image: "/hotel-categories/Boutique.jpg",
  },
  {
    title: "Beach Resort",
    description: "Sun, sea, and long unhurried afternoons near the water.",
    image: "/hotel-categories/Beach%20Resort.jpg",
  },
  {
    title: "Cabin",
    description: "Cozy, quiet stays with a slower pace and warmer textures.",
    image: "/hotel-categories/Cabin.jpg",
  },
  {
    title: "Luxury",
    description: "Polished service, elevated amenities, and standout comfort.",
    image: "/hotel-categories/Luxury.jpg",
  },
  {
    title: "Beach House",
    description: "Soft light, breezy spaces, and an effortless holiday rhythm.",
    image: "/hotel-categories/Beach%20House.jpg",
  },
];

export function BrowseByHotelType() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="section-kicker">Browse by hotel type</p>
          <h2 className="section-title text-balance">
            Start with the kind of stay you want.
          </h2>
          <p className="text-muted-foreground text-base leading-7">
            Different moods, different trips. Browse by property type before you
            even choose the destination.
          </p>
        </div>
        <Link
          href="/search"
          className="text-primary inline-flex items-center gap-2 text-sm font-semibold"
        >
          Explore all categories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        <Carousel
          opts={{ align: "start" }}
          setApi={(nextApi) => {
            setApi(nextApi);

            if (!nextApi) {
              return;
            }

            const updateScrollState = () => {
              setCanScrollPrev(nextApi.canScrollPrev());
              setCanScrollNext(nextApi.canScrollNext());
            };

            updateScrollState();
            nextApi.on("select", updateScrollState);
            nextApi.on("reInit", updateScrollState);
          }}
          className="relative"
        >
          <CarouselContent className="-ml-4">
            {hotelTypeCards.map((card) => (
              <CarouselItem
                key={card.title}
                className="pl-4 md:basis-1/2 xl:basis-1/3"
              >
                <Link
                  href={`/search?types=${encodeURIComponent(card.title)}`}
                  className="surface-panel group block h-full overflow-hidden p-0"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" /> */}
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h3 className="font-heading text-3xl leading-none font-semibold">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-7">
                        {card.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                      Browse stays
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => canScrollPrev && api?.scrollPrev()}
          className={cn(
            "absolute top-28 -left-6 z-10 h-12 w-12 rounded-full bg-white shadow-lg",
            !canScrollPrev && "opacity-60",
          )}
          aria-disabled={!canScrollPrev}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => canScrollNext && api?.scrollNext()}
          className={cn(
            "absolute top-28 -right-6 z-10 h-12 w-12 rounded-full bg-white shadow-lg",
            !canScrollNext && "opacity-60",
          )}
          aria-disabled={!canScrollNext}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
