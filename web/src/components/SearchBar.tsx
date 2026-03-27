"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  MapPin,
  Minus,
  Search,
  Users,
  Plus,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function GuestRow({
  label,
  value,
  minimum,
  onChange,
}: {
  label: string;
  value: number;
  minimum: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <span className="text-base font-semibold text-[#222]">{label}</span>
      <div className="flex items-center rounded-xl border border-[#b8b1aa] bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(minimum, value - 1))}
          className="flex h-11 w-11 items-center justify-center text-[#2f67e8] disabled:text-[#bbb]"
          disabled={value <= minimum}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex h-11 min-w-14 items-center justify-center border-x border-[#d6d0ca] text-xl font-semibold text-[#222]">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-11 w-11 items-center justify-center text-[#2f67e8]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function parseDate(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);

  useEffect(() => {
    const checkIn = parseDate(searchParams.get("checkIn"));
    const checkOut = parseDate(searchParams.get("checkOut"));
    const nextAdultCount = Number.parseInt(
      searchParams.get("adultCount") ?? "2",
      10,
    );
    const nextChildCount = Number.parseInt(
      searchParams.get("childCount") ?? "0",
      10,
    );
    const nextRoomCount = Number.parseInt(
      searchParams.get("roomCount") ?? "1",
      10,
    );

    setDestination(searchParams.get("destination") ?? "");
    setDate(
      checkIn
        ? {
            from: checkIn,
            to: checkOut,
          }
        : undefined,
    );
    setAdultCount(nextAdultCount > 0 ? nextAdultCount : 2);
    setChildCount(nextChildCount >= 0 ? nextChildCount : 0);
    setRoomCount(nextRoomCount > 0 ? nextRoomCount : 1);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (destination.trim()) {
      params.set("destination", destination.trim());
    } else {
      params.delete("destination");
    }

    if (date?.from) {
      params.set("checkIn", date.from.toISOString());
    } else {
      params.delete("checkIn");
    }

    if (date?.to) {
      params.set("checkOut", date.to.toISOString());
    } else {
      params.delete("checkOut");
    }

    params.set("adultCount", adultCount.toString());
    params.set("childCount", childCount.toString());
    params.set("roomCount", roomCount.toString());
    params.set("page", "1");

    router.push(
      `${pathname === "/search" ? pathname : "/search"}?${params.toString()}`,
    );
  };

  return (
    <div
      className={cn(
        "surface-panel mx-auto w-full rounded-[1.8rem] p-3",
        className,
      )}
    >
      <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr_1fr_190px]">
        <div className="bg-background/95 border-border/60 flex h-18 items-center gap-3 rounded-[1.25rem] border px-4">
          <div className="bg-primary/12 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <MapPin className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-[0.75rem] font-semibold tracking-[0.26em] uppercase">
              Destination
            </p>
            <Input
              placeholder="Jaipur, Kyoto, or a quiet coast"
              className="text-foreground h-auto rounded-none border-0 bg-transparent px-0 py-0.5 text-base shadow-none focus-visible:ring-0"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "bg-background/95 border-border/60 flex h-18 items-center gap-3 rounded-[1.25rem] border px-4 text-left",
                !date && "text-muted-foreground",
              )}
            >
              <div className="bg-primary/12 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <CalendarIcon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-[0.75rem] font-semibold tracking-[0.26em] uppercase">
                  Dates
                </p>
                <p className="text-foreground truncate pt-0.5 text-base">
                  {date?.from ? (
                    date.to ? (
                      `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd")}`
                    ) : (
                      format(date.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      Choose your stay window
                    </span>
                  )}
                </p>
              </div>
              <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto rounded-[1.5rem] p-0" align="start">
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

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="bg-background/95 border-border/60 flex h-18 items-center gap-3 rounded-[1.25rem] border px-4 text-left"
            >
              <div className="bg-primary/12 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[0.75rem] font-semibold tracking-[0.26em] uppercase">
                  Guests
                </p>
                <p className="text-foreground truncate pt-0.5 text-base">
                  {adultCount} adults · {childCount} children · {roomCount} room
                  {roomCount > 1 ? "s" : ""}
                </p>
              </div>
              <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[360px] rounded-[1.45rem] border border-[#e8e0d7] p-5 shadow-[0_30px_80px_-30px_rgba(60,40,20,0.35)]"
          >
            <div className="space-y-3">
              <GuestRow
                label="Adults"
                value={adultCount}
                minimum={1}
                onChange={setAdultCount}
              />
              <GuestRow
                label="Children"
                value={childCount}
                minimum={0}
                onChange={setChildCount}
              />
              <GuestRow
                label="Rooms"
                value={roomCount}
                minimum={1}
                onChange={setRoomCount}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleSearch}
          size="lg"
          className="h-18 w-full rounded-[1.25rem] px-4 text-base font-semibold shadow-[0_18px_40px_-24px_rgba(130,68,35,0.85)]"
        >
          <Search className="h-4 w-4" />
          Search stays
        </Button>
      </div>
    </div>
  );
}
