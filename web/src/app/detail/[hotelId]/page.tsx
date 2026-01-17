"use client";

import { useEffect, useState } from "react";
// import { useParams } from "next/navigation"; // useParams is not exported from next/navigation, it is from next/navigation in App Router? Wait.
// Actually `useParams` from `next/navigation` is available in newer versions but let's check.
// Safest is to use `params` prop in a Server Component or `useParams` in Client Component.
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { HotelType } from "@/shared-types";
import { GuestInfoForm } from "@/components/GuestInfoForm";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function HotelDetail() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) return;
      try {
        const data = await apiClient.get<HotelType>(
          `/api/hotels/${hotelId as string}`,
        );
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  if (loading) {
    return <div className="container mx-auto p-10">Loading...</div>; // Skeleton ideally
  }

  if (!hotel) {
    return <div className="container mx-auto p-10">Hotel not found</div>;
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex">
            {Array.from({ length: Math.ceil(hotel.starRating) }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-500 text-yellow-500"
              />
            ))}
          </span>
          <span className="text-muted-foreground text-xl">{hotel.type}</span>
        </div>
        <h1 className="text-4xl font-bold">{hotel.name}</h1>
        <p className="text-muted-foreground text-lg">
          {hotel.city}, {hotel.country}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hotel.imageUrls.map((image, index) => (
          <div
            key={image}
            className="group relative h-[300px] w-full overflow-hidden rounded-md"
          >
            <Image
              src={image}
              alt={hotel.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-b pb-6">
            <h2 className="mb-4 text-2xl font-bold">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Facilities</h2>
            <div className="flex flex-wrap gap-3">
              {hotel.facilities.map((facility) => (
                <Badge
                  key={facility}
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                >
                  {facility}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit">
          <GuestInfoForm
            hotelId={hotel._id}
            pricePerNight={hotel.pricePerNight}
          />
        </div>
      </div>
    </div>
  );
}
