import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

import { HotelType } from "@/shared-types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  hotel: HotelType;
};

export function SearchResultsCard({ hotel }: Props) {
  return (
    <article className="surface-panel grid overflow-hidden p-0 xl:grid-cols-[1.15fr_1fr]">
      <div className="relative min-h-[260px] overflow-hidden">
        <Image
          src={hotel.imageUrls[0] || "/hotels/hotel-image-01.jpg"}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#4c3323] uppercase backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          {hotel.starRating} stars
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 p-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-[0.7rem] tracking-[0.18em] uppercase">
              {hotel.type}
            </Badge>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              {hotel.city}, {hotel.country}
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href={`/detail/${hotel._id}`}
              className="font-heading hover:text-primary block text-4xl leading-none font-semibold transition-colors"
            >
              {hotel.name}
            </Link>
            <p className="text-muted-foreground line-clamp-3 text-sm leading-7">
              {hotel.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {hotel.facilities.slice(0, 4).map((facility) => (
              <span
                key={facility}
                className="bg-accent/70 text-accent-foreground rounded-full px-3 py-1 text-xs font-medium"
              >
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 4 ? (
              <span className="text-muted-foreground px-1 py-1 text-xs font-semibold tracking-[0.12em] uppercase">
                +{hotel.facilities.length - 4} more
              </span>
            ) : null}
          </div>
        </div>

        <div className="border-border/70 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-heading text-5xl leading-none font-semibold">
              ₹{hotel.pricePerNight}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">per night</p>
          </div>
          <Button asChild className="rounded-full px-5">
            <Link href={`/detail/${hotel._id}`}>
              View details
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
