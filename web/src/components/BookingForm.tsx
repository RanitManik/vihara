"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  currentUser: {
    firstName: string;
    email: string;
  }; // Mocked user type for now, or match backend User
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

  // In a real app we'd get this from context or props
  const searchParams = new URLSearchParams(window.location.search);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adultCount = parseInt(searchParams.get("adultCount") || "1");
  const childCount = parseInt(searchParams.get("childCount") || "0");
  const { hotelId } = useParams();

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
    if (!stripe || !elements) return;

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/my-bookings`,
      },
      redirect: "if_required", // Prevent auto redirect
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsLoading(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      try {
        await apiClient.post(`/api/hotels/${hotelId}/bookings`, {
          paymentIntentId: result.paymentIntent.id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adultCount: formData.adultCount,
          childCount: formData.childCount,
          totalCost: paymentIntent.totalCost, // Use the totalCost from paymentIntent props
        });
        toast.success("Booking saved!");
        // Now redirect
        window.location.href = "/my-bookings";
      } catch (error) {
        toast.error("Error saving booking");
        setIsLoading(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border grid grid-cols-1 gap-5 rounded-lg border p-5 md:grid-cols-2"
    >
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Confirm Your Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex-1 text-sm font-bold text-gray-700">
              First Name
              <input
                className="mt-1 w-full rounded border bg-gray-200 px-3 py-2 font-normal text-gray-700"
                type="text"
                readOnly
                disabled
                {...register("firstName")}
              />
            </label>
            <label className="flex-1 text-sm font-bold text-gray-700">
              Last Name
              <input
                className="mt-1 w-full rounded border bg-gray-200 px-3 py-2 font-normal text-gray-700"
                type="text"
                readOnly
                disabled
                {...register("lastName")} // Assuming last name might be in props too, simplified here
              />
            </label>
            <label className="col-span-2 flex-1 text-sm font-bold text-gray-700">
              Email
              <input
                className="mt-1 w-full rounded border bg-gray-200 px-3 py-2 font-normal text-gray-700"
                type="text"
                readOnly
                disabled
                {...register("email")}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Total Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary logic here would usually take price/night * nights */}
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">
              Total Cost: ₹{(paymentIntent.totalCost / 100).toFixed(2)}
            </div>
            <div className="text-xs">Includes taxes and fees</div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 border-none shadow-none md:col-span-2">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <Button
            disabled={isLoading}
            type="submit"
            className="mt-4 w-full text-lg font-bold"
          >
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
