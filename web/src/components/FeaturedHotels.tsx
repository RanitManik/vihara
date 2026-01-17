"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Using a local definition to ensure independence,
// though typically this would come from a shared package.
export type HotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
  starRating: number;
  description: string;
};

export function FeaturedHotels() {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await apiClient.get<HotelType[]>("/api/hotels");
        // We'll show the top 4 hotels for the featured section
        setHotels(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Featured Destinations
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Featured Destinations
        </h2>
        <Button variant="link" asChild className="hidden sm:inline-flex">
          <Link href="/search">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {hotels.map((hotel) => (
          <Card
            key={hotel._id}
            className="overflow-hidden border-none shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={hotel.imageUrls[0] || "/assets/placeholder.jpg"}
                alt={hotel.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 font-semibold"
                >
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {hotel.starRating}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-4">
              <h3 className="line-clamp-1 text-lg font-bold">{hotel.name}</h3>
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {hotel.city}, {hotel.country}
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-muted-foreground/80 line-clamp-2 text-sm">
                {hotel.description}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  ₹{hotel.pricePerNight}
                </span>
                <span className="text-muted-foreground text-xs">per night</span>
              </div>
              <Button size="sm" asChild>
                <Link href={`/detail/${hotel._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-6 flex justify-center sm:hidden">
        <Button variant="outline" asChild className="w-full">
          <Link href="/search">View All Hotels</Link>
        </Button>
      </div>
    </section>
  );
}
