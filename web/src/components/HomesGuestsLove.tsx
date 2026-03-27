"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type LovedHotel = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
  starRating: number;
  description: string;
  type: string;
};

export function HomesGuestsLove() {
  const [hotels, setHotels] = useState<LovedHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await apiClient.get<LovedHotel[]>("/api/hotels");
        setHotels(data);
      } catch (error) {
        console.error("Failed to fetch top-rated hotels", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const topRatedHotels = useMemo(
    () =>
      [...hotels]
        .sort((a, b) => {
          if (b.starRating !== a.starRating) {
            return b.starRating - a.starRating;
          }

          return a.pricePerNight - b.pricePerNight;
        })
        .slice(0, 3),
    [hotels],
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="section-kicker">Homes guests love</p>
          <h2 className="section-title text-balance">
            Highest-rated stays with the strongest first impression.
          </h2>
          <p className="text-muted-foreground text-base leading-7">
            These are the kinds of hotels guests bookmark quickly: strong
            reviews, confident design, and reliable comfort.
          </p>
        </div>
        <Button variant="outline" asChild className="rounded-full px-5">
          <Link href="/search">
            See more favorites
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-panel overflow-hidden p-0">
              <Skeleton className="h-60 w-full rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-8 w-2/3 rounded-2xl" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topRatedHotels.map((hotel) => (
            <article
              key={hotel._id}
              className="surface-panel group overflow-hidden p-0"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={hotel.imageUrls[0] || "/hotels/hotel-image-01.jpg"}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#5b3a28] uppercase">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {hotel.starRating} stars
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                    <MapPin className="h-3.5 w-3.5" />
                    {hotel.city}, {hotel.country}
                  </p>
                  <h3 className="font-heading text-3xl leading-none font-semibold">
                    {hotel.name}
                  </h3>
                </div>

                <p className="text-muted-foreground line-clamp-3 text-sm leading-7">
                  {hotel.description}
                </p>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-heading text-4xl leading-none font-semibold">
                      ₹{hotel.pricePerNight}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      per night
                    </p>
                  </div>
                  <Button asChild className="rounded-full px-5">
                    <Link href={`/detail/${hotel._id}`}>View</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
