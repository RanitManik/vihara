"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

export function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  const [date, setDate] = useState<DateRange | undefined>();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAppContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      adultCount: 1,
      childCount: 0,
    },
  });

  const onSignInClick = (data: GuestInfoFormData) => {
    // Save search criteria to session storage or URL params?
    // For now, simpler redirection
    router.push("/auth"); // simplified redirection
  };

  const onSubmit = (data: GuestInfoFormData) => {
    if (!date?.from || !date?.to) {
      // Handle date validation error
      return;
    }

    // Push path to booking page with query params
    const params = new URLSearchParams();
    params.set("checkIn", date.from.toISOString());
    params.set("checkOut", date.to.toISOString());
    params.set("adultCount", data.adultCount.toString());
    params.set("childCount", data.childCount.toString());
    params.set("numberOfNights", "1"); // Calculator logic needed

    router.push(`/hotel/${hotelId}/booking?${params.toString()}`);
  };

  return (
    <div className="bg-secondary flex flex-col gap-4 rounded-lg p-4 shadow-md">
      <h3 className="text-md text-foreground font-bold">
        ₹{pricePerNight}{" "}
        <span className="text-muted-foreground text-sm font-normal">
          / night
        </span>
      </h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 items-center gap-4">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Check-in - Check-out</span>
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
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          <div className="bg-background border-input flex gap-2 rounded-md border px-2 py-1 text-sm">
            <label className="flex flex-1 items-center">
              Adults:
              <input
                className="w-full bg-transparent p-1 font-bold focus:outline-none"
                type="number"
                min={1}
                max={20}
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
            <label className="flex flex-1 items-center">
              Children:
              <input
                className="w-full bg-transparent p-1 font-bold focus:outline-none"
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-xs font-bold text-red-500">
                {errors.adultCount.message}
              </span>
            )}
          </div>

          {isLoggedIn ? (
            <Button type="submit" className="h-12 w-full text-lg font-bold">
              Book Now
            </Button>
          ) : (
            <Button type="submit" className="h-12 w-full text-lg font-bold">
              Sign in to Book
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
