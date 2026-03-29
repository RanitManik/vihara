"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Hotel,
  MapPin,
  Plus,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageIntroSkeleton,
  PortfolioCardsSkeleton,
} from "@/components/PageSkeletons";
import { useGetMyHotels } from "@/hooks/use-hotels";

export default function MyHotels() {
  const { data: hotels, isLoading } = useGetMyHotels();

  if (isLoading) {
    return (
      <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
        <div className="container-shell space-y-6">
          <PageIntroSkeleton />
          <PortfolioCardsSkeleton />
        </div>
      </main>
    );
  }

  const hotelList = hotels || [];

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell space-y-6">
        <section className="surface-panel px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="section-kicker">Host dashboard</p>
              <h1 className="font-heading text-5xl leading-none font-semibold">
                My hotels
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7">
                Review listings and keep every property aligned with a premium
                guest experience.
              </p>
            </div>
            <Button asChild className="rounded-full px-6">
              <Link href="/add-hotel">
                <Plus className="h-4 w-4" />
                Add hotel
              </Link>
            </Button>
          </div>
        </section>

        {!hotelList.length ? (
          <section className="surface-panel flex min-h-80 items-center justify-center p-8 text-center">
            <div className="space-y-4">
              <h2 className="font-heading text-4xl leading-none font-semibold">
                No hotels yet
              </h2>
              <p className="text-muted-foreground max-w-md text-sm leading-6">
                Start with your strongest property and build a host portfolio
                that feels as polished as the front-facing experience.
              </p>
              <Button asChild className="rounded-full px-6">
                <Link href="/add-hotel">Create your first listing</Link>
              </Button>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-2">
            {hotelList.map((hotel) => (
              <article
                key={hotel._id}
                data-testid="hotel-card"
                className="surface-panel overflow-hidden p-0"
              >
                <div className="relative min-h-[260px] overflow-hidden">
                  <Image
                    src={hotel.imageUrls[0] || "/hotels/hotel-image-01.jpg"}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                        {hotel.type}
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/14 px-3 py-1 text-sm backdrop-blur-sm">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                        {hotel.starRating}
                      </div>
                    </div>
                    <h2 className="font-heading mt-4 text-4xl leading-none font-semibold">
                      {hotel.name}
                    </h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                      <MapPin className="h-4 w-4" />
                      {hotel.city}, {hotel.country}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-7">
                    {hotel.description}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                        Pricing
                      </p>
                      <p className="mt-2 text-base font-semibold">
                        ₹{hotel.pricePerNight.toLocaleString("en-IN")} / night
                      </p>
                    </div>

                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                        Capacity
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-base font-semibold">
                        <Users className="h-4 w-4" />
                        {hotel.adultCount} adults, {hotel.childCount} children
                      </p>
                    </div>

                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                        Category
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-base font-semibold">
                        <Building2 className="h-4 w-4" />
                        {hotel.type}
                      </p>
                    </div>

                    <div className="bg-secondary rounded-2xl p-4">
                      <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                        Portfolio
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-base font-semibold">
                        <Hotel className="h-4 w-4" />
                        Ready for updates
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button asChild className="rounded-full px-5">
                      <Link href={`/edit-hotel/${hotel._id}`}>
                        Manage listing
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
