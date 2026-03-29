"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

type Props = {
  currentUser: {
    firstName: string;
    email: string;
  };
  paymentIntent: {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
  };
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

export function BookingForm({ currentUser, paymentIntent }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adultCount = parseInt(searchParams.get("adultCount") || "1");
  const childCount = parseInt(searchParams.get("childCount") || "0");
  const { hotelId } = useParams();
  const router = useRouter();

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      email: currentUser.email,
      adultCount,
      childCount,
      checkIn,
      checkOut,
      hotelId: hotelId as string,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/my-bookings`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      try {
        await apiClient.post(`/api/hotels/${hotelId}/bookings`, {
          paymentIntentId: result.paymentIntent.id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          totalCost: paymentIntent.totalCost,
        });
        toast.success("Booking saved!");
        router.push("/my-bookings");
      } catch {
        toast.error("Error saving booking");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="surface-panel p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="section-kicker">Guest details</p>
              <h2 className="font-heading mt-3 text-4xl leading-none font-semibold">
                Confirm your details
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">First name</span>
                <Input
                  type="text"
                  readOnly
                  disabled
                  className="bg-secondary h-12 rounded-2xl"
                  {...register("firstName")}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Last name</span>
                <Input
                  type="text"
                  readOnly
                  disabled
                  className="bg-secondary h-12 rounded-2xl"
                  {...register("lastName")}
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold">Email</span>
                <Input
                  type="text"
                  readOnly
                  disabled
                  className="bg-secondary h-12 rounded-2xl"
                  {...register("email")}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="surface-panel p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="section-kicker">Payment</p>
              <h2 className="font-heading mt-3 text-4xl leading-none font-semibold">
                Secure checkout
              </h2>
            </div>

            <div className="border-border/70 bg-background/80 rounded-[1.4rem] border p-4">
              <PaymentElement />
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="h-12 w-full rounded-full text-base font-semibold"
            >
              {isLoading ? "Booking..." : "Confirm booking"}
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
