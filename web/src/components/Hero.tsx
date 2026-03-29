"use client";

import { Suspense, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

import { SearchBar } from "./SearchBar";
import { Badge } from "./ui/badge";

const heroImages = [
  "/hotels/hotel-image-01.jpg",
  "/hotels/hotel-image-04.jpg",
  "/hotels/hotel-image-08.jpg",
  "/hotels/hotel-image-12.jpg",
];

export function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-[#261b16] px-0 pt-12 text-white sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0">
            {heroImages.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt="Curated hotel background"
                fill
                priority={index === 0}
                className={`object-cover object-center transition-all duration-7000 ease-in-out ${
                  index === activeImage
                    ? "scale-110 opacity-40"
                    : "scale-100 opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,196,133,0.32),transparent_30%),linear-gradient(135deg,rgba(20,14,10,0.88),rgba(20,14,10,0.45)_44%,rgba(20,14,10,0.88))]" />
          </div>

          <div className="relative space-y-7">
            <Badge
              variant="outline"
              className="ml-6 flex border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-amber-200 backdrop-blur-md sm:ml-0"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Curated for design-forward travelers
            </Badge>

            <div className="space-y-4 px-6 sm:px-0">
              <h1 className="font-heading text-5xl font-medium tracking-tight text-balance sm:text-7xl lg:text-8xl">
                Stay somewhere that{" "}
                <span className="font-serif text-amber-200/90 italic">
                  shapes
                </span>{" "}
                the trip.
              </h1>
              <p className="max-w-xl text-base leading-relaxed font-light text-white/50 sm:text-lg">
                Vihara helps you discover hotels with atmosphere, not just
                availability. Search beautiful stays, book faster, and move
                through your journey with less friction.
              </p>
            </div>

            <div className="pt-2">
              <Suspense
                fallback={
                  <div className="surface-panel mx-auto h-22 w-full rounded-[1.8rem] p-3" />
                }
              >
                <SearchBar />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
