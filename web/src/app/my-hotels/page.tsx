"use client";

import { apiClient } from "@/lib/api-client";
import { HotelType } from "@/shared-types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Hotel, Star, Edit } from "lucide-react";

export default function MyHotels() {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await apiClient.get<HotelType[]>("/api/my-hotels");
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <div className="container mx-auto p-10">Loading...</div>;

  return (
    <div className="container mx-auto space-y-5 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Button asChild className="text-lg font-bold">
          <Link href="/add-hotel">Add Hotel</Link>
        </Button>
      </div>

      {!hotels || hotels.length === 0 ? (
        <span className="text-muted-foreground mt-10 block text-center text-xl">
          No Hotels found
        </span>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              data-testid="hotel-card"
              className="border-border bg-card flex flex-col gap-5 rounded-lg border p-8 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    {hotel.name}
                  </h2>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {hotel.city}, {hotel.country}
                  </div>
                </div>
              </div>

              <div className="text-muted-foreground line-clamp-3 overflow-hidden whitespace-pre-line">
                {hotel.description}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="border-input flex items-center gap-2 rounded-sm border p-3">
                  <MapPin className="text-primary h-4 w-4" />
                  {hotel.city}, {hotel.country}
                </div>
                <div className="border-input flex items-center gap-2 rounded-sm border p-3">
                  <Building2 className="text-primary h-4 w-4" />
                  {hotel.type}
                </div>
                <div className="border-input flex items-center gap-2 rounded-sm border p-3">
                  <span className="flex items-center gap-1 font-bold">
                    ₹{hotel.pricePerNight}{" "}
                    <span className="text-xs font-normal">per night</span>
                  </span>
                </div>
                <div className="border-input flex items-center gap-2 rounded-sm border p-3">
                  <div className="flex items-center gap-1">
                    {hotel.adultCount} adults, {hotel.childCount} children
                  </div>
                </div>
                <div className="border-input flex items-center gap-2 rounded-sm border p-3">
                  <Star className="text-primary h-4 w-4" />
                  {hotel.starRating} Star Rating
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="default" asChild className="text-lg font-bold">
                  <Link href={`/edit-hotel/${hotel._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
