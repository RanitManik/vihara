import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  {
    city: "Paris",
    image: "/trending-locations/paris.jpg",
    copy: "Classic elegance with boutique corners and terrace views.",
    className: "",
  },
  {
    city: "Goa",
    image: "/trending-locations/goa.jpg",
    copy: "Beach days, late dinners, and design-forward resorts.",
    className: "md:col-span-2",
  },
  {
    city: "Kyoto",
    image: "/trending-locations/kyoto.jpg",
    copy: "Quiet luxury, temples, and intimate city stays.",
    className: "",
  },
  {
    city: "Jaipur",
    image: "/trending-locations/jaipur.jpg",
    copy: "Palaces, courtyards, and richly atmospheric hotels.",
    className: "",
  },
  {
    city: "Manali",
    image: "/trending-locations/manali.jpg",
    copy: "Mountain air, cabins, and a slower reset.",
    className: "",
  },
];

export function TrendingDestinations() {
  return (
    <section className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="section-kicker">Trending destinations</p>
        <h2 className="section-title text-balance">
          Cities and escapes guests are chasing right now.
        </h2>
        <p className="text-muted-foreground text-base leading-7">
          A more visual way to browse where the momentum is, with destinations
          that already have the right kinds of stays waiting.
        </p>
      </div>

      <div className="grid auto-rows-[230px] gap-4 md:grid-cols-3 lg:auto-rows-[240px]">
        {destinations.map((destination) => (
          <Link
            key={destination.city}
            href={`/search?destination=${encodeURIComponent(destination.city)}`}
            className={`group surface-panel relative overflow-hidden p-0 ${destination.className}`}
          >
            <Image
              src={destination.image}
              alt={destination.city}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,14,10,0.06),rgba(19,14,10,0.74))]" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
              {/* <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  Trending #{index + 1}
                </div>
                <ArrowUpRight className="h-5 w-5" />
              </div> */}
              <div className="flex items-center justify-between gap-3">
                <div className="grid">
                  <h3 className="font-heading mt-3 text-3xl leading-none font-semibold md:text-4xl">
                    {destination.city}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-white/78">
                    {destination.copy}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 self-end" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
