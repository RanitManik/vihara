"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { BookingForm } from "@/components/BookingForm";
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
    if (!hotelId) return;
    const fetchHotel = async () => {
      try {
        const data = await apiClient.get<HotelType>(
          `/api/hotels/${hotelId as string}`,
        );
        setHotel(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotel();
  }, [hotelId]);

  useEffect(() => {
    if (hotelId && numberOfNights > 0) {
      const createPaymentIntent = async () => {
        try {
          const data = await apiClient.post<PaymentIntentResponse>(
            `/api/hotels/${hotelId}/bookings/payment-intent`,
            {
              numbersOfNights: numberOfNights,
            },
          );
          setPaymentIntentData(data);
        } catch (err) {
          console.error(err);
        }
      };
      createPaymentIntent();
    }
  }, [hotelId, numberOfNights]);

  if (!hotel || !paymentIntentData)
    return <div className="p-10">Loading booking...</div>;

  return (
    <div className="container mx-auto grid gap-5 py-10 md:grid-cols-[1fr_2fr]">
      <div className="bg-background border-border flex h-fit flex-col gap-4 rounded-lg border p-5">
        <h2 className="text-xl font-bold">Your Booking Details</h2>
        <div className="border-b py-2">
          Location:
          <div className="font-bold">
            {hotel.name}, {hotel.city}, {hotel.country}
          </div>
        </div>
        <div className="flex justify-between border-b py-2">
          <div>
            Check-in
            <div className="font-bold">
              {searchParams.get("checkIn")?.split("T")[0]}
            </div>
          </div>
          <div>
            Check-out
            <div className="font-bold">
              {searchParams.get("checkOut")?.split("T")[0]}
            </div>
          </div>
        </div>
        <div className="border-b py-2">
          Total Length of Stay:
          <div className="font-bold">{numberOfNights} nights</div>
        </div>
        <div>
          Guests:{" "}
          <div className="font-bold">
            {searchParams.get("adultCount")} adults,{" "}
            {searchParams.get("childCount")} children
          </div>
        </div>
      </div>

      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntentData.clientSecret }}
      >
        <BookingForm
          currentUser={{ firstName: "Test", email: "test@example.com" }} // TODO: Real Auth
          paymentIntent={paymentIntentData}
        />
      </Elements>
    </div>
  );
}
