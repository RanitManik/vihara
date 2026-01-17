"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Search, Users } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  const handleSearch = () => {
    // Construct search params
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (adultCount) params.set("adultCount", adultCount.toString());
    if (childCount) params.set("childCount", childCount.toString());

    // Simplistic date handling for demo - would need robust serialization
    // Skipping date logic for now to keep it simple or adding if selected

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-background flex w-full max-w-5xl flex-col items-center gap-2 rounded-xl p-2 shadow-2xl md:flex-row md:p-4">
      <div className="flex w-full flex-1 items-center gap-2 rounded-lg border px-3 py-2 md:border-0 md:px-0">
        <MapPin className="text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Where are you going?"
          className="placeholder:text-muted-foreground border-0 px-0 shadow-none focus-visible:ring-0"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="bg-border hidden h-8 w-[1px] md:block" />

      <div className="flex w-full flex-1 items-center gap-2 rounded-lg border px-3 py-2 md:border-0 md:px-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"ghost"}
              className={cn(
                "w-full justify-start px-0 text-left font-normal hover:bg-transparent",
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
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-border hidden h-8 w-[1px] md:block" />

      <div className="flex w-full flex-1 items-center gap-2 rounded-lg border px-3 py-2 md:border-0 md:px-0">
        <Users className="text-muted-foreground h-5 w-5" />
        <div className="flex flex-1 gap-2">
          <label className="text-muted-foreground flex items-center gap-1 text-sm">
            Adults:
            <input
              className="text-foreground w-full max-w-[30px] border-none bg-transparent font-semibold focus:outline-none"
              type="number"
              min={1}
              max={20}
              value={adultCount}
              onChange={(e) => setAdultCount(parseInt(e.target.value))}
            />
          </label>
          <label className="text-muted-foreground flex items-center gap-1 text-sm">
            Children:
            <input
              className="text-foreground w-full max-w-[30px] border-none bg-transparent font-semibold focus:outline-none"
              type="number"
              min={0}
              max={20}
              value={childCount}
              onChange={(e) => setChildCount(parseInt(e.target.value))}
            />
          </label>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        size="lg"
        className="w-full rounded-lg font-bold md:w-auto"
      >
        Search
      </Button>
    </div>
  );
}
