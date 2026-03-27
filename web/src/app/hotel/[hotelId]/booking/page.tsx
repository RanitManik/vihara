"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams, useSearchParams } from "next/navigation";
import { Calendar, CreditCard, Hotel, Users } from "lucide-react";

import { BookingForm } from "@/components/BookingForm";
import { BookingPageSkeleton } from "@/components/PageSkeletons";
import { apiClient } from "@/lib/api-client";
import { HotelType, PaymentIntentResponse } from "@/shared-types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY || "");

export default function BookingPage() {
  const { hotelId } = useParams();
  const searchParams = useSearchParams();
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [paymentIntentData, setPaymentIntentData] =
    useState<PaymentIntentResponse | null>(null);

  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (checkIn && checkOut) {
      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      setNumberOfNights(nights);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hotelId) {
      return;
    }

    const fetchHotel = async () => {
      try {
        const data = await apiClient.get<HotelType>(
          `/api/hotels/${hotelId as string}`,
        );
        setHotel(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHotel();
  }, [hotelId]);

  useEffect(() => {
    if (!hotelId || numberOfNights <= 0) {
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const data = await apiClient.post<PaymentIntentResponse>(
          `/api/hotels/${hotelId}/bookings/payment-intent`,
          {
            numbersOfNights: numberOfNights,
          },
        );
        setPaymentIntentData(data);
      } catch (error) {
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [hotelId, numberOfNights]);

  if (!hotel || !paymentIntentData) {
    return (
      <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
        <div className="container-shell">
          <BookingPageSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell space-y-6">
        <section className="surface-panel px-6 py-8 sm:px-8">
          <div className="space-y-3">
            <p className="section-kicker">Finalize your stay</p>
            <h1 className="font-heading text-5xl leading-none font-semibold">
              Booking checkout
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-7">
              Review the stay details, confirm your information, and complete
              payment in one flow.
            </p>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <aside className="surface-panel p-6 sm:p-8 xl:sticky xl:top-24 xl:h-fit">
            <div className="space-y-5">
              <div>
                <p className="section-kicker">Reservation summary</p>
                <h2 className="font-heading mt-3 text-4xl leading-none font-semibold">
                  {hotel.name}
                </h2>
              </div>

              <div className="bg-secondary rounded-[1.4rem] p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                  <Hotel className="h-3.5 w-3.5" />
                  Location
                </p>
                <p className="mt-2 text-base font-semibold">
                  {hotel.city}, {hotel.country}
                </p>
              </div>

              <div className="bg-secondary rounded-[1.4rem] p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                  <Calendar className="h-3.5 w-3.5" />
                  Stay dates
                </p>
                <p className="mt-2 text-base font-semibold">
                  {searchParams.get("checkIn")?.split("T")[0]} -{" "}
                  {searchParams.get("checkOut")?.split("T")[0]}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {numberOfNights} nights
                </p>
              </div>

              <div className="bg-secondary rounded-[1.4rem] p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                  <Users className="h-3.5 w-3.5" />
                  Guests
                </p>
                <p className="mt-2 text-base font-semibold">
                  {searchParams.get("adultCount")} adults,{" "}
                  {searchParams.get("childCount")} children
                </p>
              </div>

              <div className="bg-secondary rounded-[1.4rem] p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                  <CreditCard className="h-3.5 w-3.5" />
                  Estimated total
                </p>
                <p className="mt-2 text-base font-semibold">
                  ₹{(paymentIntentData.totalCost / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </aside>

          <Elements
            stripe={stripePromise}
            options={{ clientSecret: paymentIntentData.clientSecret }}
          >
            <BookingForm
              currentUser={{ firstName: "Test", email: "test@example.com" }}
              paymentIntent={paymentIntentData}
            />
          </Elements>
        </div>
      </div>
    </main>
  );
}
