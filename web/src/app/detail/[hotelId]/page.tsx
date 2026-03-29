"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  MapPin,
  Star,
  X,
} from "lucide-react";

import { GuestInfoForm } from "@/components/GuestInfoForm";
import { HotelDetailSkeleton } from "@/components/PageSkeletons";
import { Badge } from "@/components/ui/badge";
import { useGetHotelById } from "@/hooks/use-hotels";

export default function HotelDetail() {
  const { hotelId } = useParams();
  const { data: hotel, isLoading: loading } = useGetHotelById(
    hotelId as string,
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!hotel || hotel.imageUrls.length <= 1 || isLightboxOpen) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        currentIndex === hotel.imageUrls.length - 1 ? 0 : currentIndex + 1,
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, [hotel, isLightboxOpen]);

  if (loading) {
    return (
      <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
        <div className="container-shell">
          <HotelDetailSkeleton />
        </div>
      </main>
    );
  }

  if (!hotel) {
    return <div className="container-shell px-4 py-12">Hotel not found.</div>;
  }

  const images = hotel.imageUrls.length
    ? hotel.imageUrls
    : ["/hotels/hotel-image-01.jpg"];
  const activeImage = images[activeImageIndex] || images[0];

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <>
      <main key={hotel._id} className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
        <div className="container-shell space-y-6">
          <section className="surface-panel overflow-hidden p-0">
            <div className="relative min-h-115 overflow-hidden">
              {images.map((image, index) => (
                <Image
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${hotel.name} image ${index + 1}`}
                  fill
                  priority={index === 0}
                  className={`will-change-opacity object-cover transition-opacity duration-600 ease-linear ${
                    index === activeImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,20,14,0.15),rgba(29,20,14,0.85))]" />

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/35"
                aria-label="Open full size gallery image"
              >
                <Expand className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                <div className="max-w-4xl space-y-4 text-white">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-full border border-white/15 bg-white/15 px-3 py-1 text-[0.72rem] tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                      {hotel.type}
                    </Badge>
                    <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm backdrop-blur-sm">
                      <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                      {hotel.starRating} star stay
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm backdrop-blur-sm">
                      <MapPin className="h-4 w-4" />
                      {hotel.city}, {hotel.country}
                    </div>
                  </div>

                  <h1 className="font-heading text-5xl leading-none font-medium sm:text-6xl lg:text-7xl">
                    {hotel.name}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-white/76">
                    {hotel.address}
                  </p>
                </div>
              </div>

              {images.length > 1 ? (
                <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2 sm:bottom-8">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-indicator-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        index === activeImageIndex
                          ? "h-2 w-8 bg-white/85"
                          : "h-2 w-2 bg-white/45 hover:bg-white/65"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <article className="surface-panel p-6 sm:p-8">
                <p className="section-kicker">About this stay</p>
                <h2 className="font-heading mt-3 text-5xl leading-none font-semibold">
                  Designed for a better pause.
                </h2>
                <p className="text-muted-foreground mt-5 text-base leading-8 whitespace-pre-line">
                  {hotel.description}
                </p>
              </article>

              <article className="surface-panel p-6 sm:p-8">
                <p className="section-kicker">Facilities</p>
                <h2 className="font-heading mt-3 text-5xl leading-none font-semibold">
                  What you can expect
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {hotel.facilities.map((facility) => (
                    <Badge
                      key={facility}
                      className="bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-sm font-medium"
                    >
                      {facility}
                    </Badge>
                  ))}
                </div>
              </article>
            </div>

            <aside className="xl:sticky xl:top-24 xl:h-fit">
              <GuestInfoForm
                hotelId={hotel._id}
                pricePerNight={hotel.pricePerNight}
              />
            </aside>
          </section>
        </div>
      </main>

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close full size image"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Show previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                className="absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Show next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <div className="relative h-[78vh] w-full max-w-6xl overflow-hidden rounded-[2rem]">
            <Image
              src={activeImage}
              alt={`${hotel.name} full size image ${activeImageIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {images.length > 1 ? (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/8 px-4 py-3 backdrop-blur-sm">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-lightbox-indicator-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeImageIndex
                      ? "h-2 w-8 bg-white"
                      : "h-2 w-2 bg-white/45 hover:bg-white/65"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
