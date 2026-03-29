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
import { useCreateBooking } from "@/hooks/use-hotels";
import { UserType } from "@/shared-types";

type Props = {
  currentUser: UserType;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { hotelId } = useParams();
  const { mutate: saveBooking, isPending: isSaving } = useCreateBooking(
    hotelId as string,
  );

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adultCount = parseInt(searchParams.get("adultCount") || "1");
  const childCount = parseInt(searchParams.get("childCount") || "0");

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
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

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/my-bookings`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsProcessing(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      saveBooking(
        {
          paymentIntentId: result.paymentIntent.id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          totalCost: paymentIntent.totalCost,
        },
        {
          onSuccess: () => router.push("/my-bookings"),
          onSettled: () => setIsProcessing(false),
        },
      );
    } else {
      setIsProcessing(false);
    }
  };

  const isLoading = isProcessing || isSaving;

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
