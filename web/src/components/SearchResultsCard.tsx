import Link from "next/link";
import { HotelType } from "@/shared-types";
import { Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// Reusing the type from shared or defining a compatible one
// Importing from api/src is risky if build boundaries prevent it.
// Safest to define local interface or use shared package properly.
// Given previous FeaturedHotels use, I'll stick to a local or shared definition strategy.

type Props = {
  hotel: HotelType;
};

export function SearchResultsCard({ hotel }: Props) {
  return (
    <Card className="grid grid-cols-1 overflow-hidden transition-all hover:shadow-lg xl:grid-cols-[2fr_3fr]">
      <div className="relative aspect-video w-full overflow-hidden xl:aspect-auto xl:h-full">
        <Image
          src={hotel.imageUrls[0] || "/assets/placeholder.jpg"}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="grid grid-cols-1 gap-4 p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex">
              {Array.from({ length: Math.ceil(hotel.starRating) }).map(
                (_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-500 text-yellow-500"
                  />
                ),
              )}
            </span>
            <span className="text-muted-foreground ml-1 text-sm">
              {hotel.type}
            </span>
          </div>
          <Link
            href={`/detail/${hotel._id}`}
            className="cursor-pointer text-2xl font-bold hover:underline"
          >
            {hotel.name}
          </Link>
          <p className="text-muted-foreground line-clamp-2 text-sm md:line-clamp-3">
            {hotel.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {hotel.facilities.slice(0, 3).map((facility) => (
            <Badge
              key={facility}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {facility}
            </Badge>
          ))}
          {hotel.facilities.length > 3 && (
            <span className="text-muted-foreground self-center text-sm">
              +{hotel.facilities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="text-2xl font-bold">₹{hotel.pricePerNight}</span>
            <span className="text-muted-foreground text-xs">per night</span>
          </div>
          <Button asChild size="lg" className="w-full font-bold sm:w-auto">
            <Link href={`/detail/${hotel._id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
