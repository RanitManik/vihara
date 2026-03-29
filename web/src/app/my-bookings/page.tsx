"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, Calendar, CreditCard, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageIntroSkeleton,
  PortfolioCardsSkeleton,
} from "@/components/PageSkeletons";
import { useGetMyBookings } from "@/hooks/use-hotels";

export default function MyBookings() {
  const { data: hotels, isLoading } = useGetMyBookings();

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

  const bookingList = hotels || [];

  if (!bookingList.length) {
    return (
      <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
        <div className="container-shell space-y-6">
          <section className="surface-panel px-6 py-8 sm:px-8">
            <div className="space-y-3">
              <p className="section-kicker">Your travel desk</p>
              <h1 className="font-heading text-5xl leading-none font-semibold">
                My bookings
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7">
                Keep track of every reservation in one calm, clear dashboard.
              </p>
            </div>
          </section>

          <section className="surface-panel flex min-h-80 items-center justify-center p-8 text-center">
            <div className="space-y-4">
              <h2 className="font-heading text-4xl leading-none font-semibold">
                No bookings yet
              </h2>
              <p className="text-muted-foreground max-w-md text-sm leading-6">
                When you reserve a stay, your itinerary and payment details will
                show up here.
              </p>
              <Button asChild className="rounded-full px-6">
                <Link href="/">Start searching</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell space-y-6">
        <section className="surface-panel px-6 py-8 sm:px-8">
          <div className="space-y-3">
            <p className="section-kicker">Your travel desk</p>
            <h1 className="font-heading text-5xl leading-none font-semibold">
              My bookings
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-7">
              Every confirmed stay, neatly organized with dates, guest counts,
              and payment summaries.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          {bookingList.map((hotel) => (
            <article
              key={hotel._id}
              className="surface-panel grid overflow-hidden p-0 lg:grid-cols-[340px_1fr]"
            >
              <div className="relative min-h-70 overflow-hidden">
                <Image
                  src={hotel.imageUrls[0] || "/hotels/hotel-image-01.jpg"}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-sm tracking-[0.18em] text-white/80 uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                    Upcoming reservation
                  </p>
                  <h2 className="font-heading mt-3 text-4xl leading-none font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {hotel.name}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                    <MapPin className="h-4 w-4" />
                    {hotel.city}, {hotel.country}
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-4 xl:grid-cols-2">
                  {hotel.bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-secondary/70 rounded-[1.4rem] p-5"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                            <Calendar className="h-3.5 w-3.5" />
                            Stay dates
                          </p>
                          <p className="mt-2 text-base font-semibold">
                            {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                            <Building2 className="h-3.5 w-3.5" />
                            Guests
                          </p>
                          <p className="mt-2 text-base font-semibold">
                            {booking.adultCount} adults, {booking.childCount}{" "}
                            children
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                            <CreditCard className="h-3.5 w-3.5" />
                            Total cost
                          </p>
                          <p className="mt-2 text-base font-semibold">
                            ₹{(booking.totalCost / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
