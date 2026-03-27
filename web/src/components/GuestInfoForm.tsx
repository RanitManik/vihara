"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  adultCount: number;
  childCount: number;
};

export function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  const [date, setDate] = useState<DateRange | undefined>();
  const router = useRouter();
  const { isLoggedIn } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      adultCount: 2,
      childCount: 0,
    },
  });

  const onSignInClick = () => {
    router.push("/auth");
  };

  const onSubmit = (data: GuestInfoFormData) => {
    if (!date?.from || !date?.to) {
      return;
    }

    const params = new URLSearchParams();
    params.set("checkIn", date.from.toISOString());
    params.set("checkOut", date.to.toISOString());
    params.set("adultCount", data.adultCount.toString());
    params.set("childCount", data.childCount.toString());
    params.set("numberOfNights", "1");

    router.push(`/hotel/${hotelId}/booking?${params.toString()}`);
  };

  return (
    <div className="surface-panel p-6 sm:p-8">
      <div className="space-y-3">
        <p className="section-kicker">Reserve this stay</p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-heading text-5xl leading-none font-semibold">
              ₹{pricePerNight}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">per night</p>
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-full px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase">
            Flexible planning
          </div>
        </div>
      </div>

      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
        className="mt-6 space-y-5"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-14 w-full justify-start rounded-2xl px-4 text-left font-medium",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd")}`
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Select check-in and check-out</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(currentDate) => currentDate < new Date()}
            />
          </PopoverContent>
        </Popover>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Adults</span>
            <input
              type="number"
              min={1}
              max={20}
              className="border-input bg-background focus:ring-ring/40 h-12 w-full rounded-2xl border px-4 outline-none focus:ring-2"
              {...register("adultCount", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "There must be at least one adult",
                },
                valueAsNumber: true,
              })}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Children</span>
            <input
              type="number"
              min={0}
              max={20}
              className="border-input bg-background focus:ring-ring/40 h-12 w-full rounded-2xl border px-4 outline-none focus:ring-2"
              {...register("childCount", {
                valueAsNumber: true,
              })}
            />
          </label>
        </div>

        {errors.adultCount ? (
          <p className="text-sm font-medium text-red-600">
            {errors.adultCount.message}
          </p>
        ) : null}

        <div className="bg-secondary/70 rounded-[1.4rem] p-4 text-sm leading-6">
          Your final rate and booking details are confirmed in the next step.
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full text-base font-semibold"
        >
          {isLoggedIn ? "Continue to booking" : "Sign in to reserve"}
        </Button>
      </form>
    </div>
  );
}
