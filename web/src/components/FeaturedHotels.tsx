"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type HotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
  starRating: number;
  description: string;
  type?: string;
};

export function FeaturedHotels() {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await apiClient.get<HotelType[]>("/api/hotels");
        setHotels(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="section-kicker">Featured stays</p>
          <h2 className="section-title text-balance">
            Places worth planning an itinerary around.
          </h2>
          <p className="text-muted-foreground text-base leading-7">
            A sharper edit of high-comfort stays, resort escapes, and city
            hotels with enough personality to remember after checkout.
          </p>
        </div>
        <Button variant="outline" asChild className="rounded-full px-5">
          <Link href="/search">
            View all stays
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-panel overflow-hidden p-0">
              <Skeleton className="h-72 w-full rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && hotels.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hotels.map((hotel, index) => (
            <article
              key={hotel._id}
              className="surface-panel group overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={hotel.imageUrls[0] || "/hotels/hotel-image-01.jpg"}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {hotel.starRating}-star stay
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#3f291b] uppercase">
                  #{String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-[0.7rem] tracking-[0.18em] uppercase">
                    {hotel.type || "Curated pick"}
                  </Badge>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4" />
                    {hotel.city}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-3xl leading-none font-semibold">
                    {hotel.name}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-6">
                    {hotel.description}
                  </p>
                </div>

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
                    <Link href={`/detail/${hotel._id}`}>View stay</Link>
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
