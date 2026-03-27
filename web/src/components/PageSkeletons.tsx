import { Skeleton } from "@/components/ui/skeleton";

export function PageIntroSkeleton() {
  return (
    <section className="surface-panel px-6 py-8 sm:px-8">
      <div className="space-y-4">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-12 w-72 rounded-2xl" />
        <Skeleton className="h-5 w-full max-w-2xl rounded-full" />
        <Skeleton className="h-5 w-full max-w-xl rounded-full" />
      </div>
    </section>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="surface-panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-56 rounded-full" />
        </div>
        <Skeleton className="h-11 w-52 rounded-full" />
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="surface-panel grid overflow-hidden p-0 xl:grid-cols-[1.15fr_1fr]"
        >
          <Skeleton className="min-h-[260px] w-full rounded-none" />
          <div className="space-y-5 p-6">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-2/3 rounded-2xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-24 rounded-2xl" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioCardsSkeleton() {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="surface-panel overflow-hidden p-0">
          <Skeleton className="h-[260px] w-full rounded-none" />
          <div className="space-y-5 p-6">
            <Skeleton className="h-10 w-2/3 rounded-2xl" />
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((__, cardIndex) => (
                <Skeleton key={cardIndex} className="h-24 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function HotelDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="surface-panel overflow-hidden p-0">
        <Skeleton className="h-[460px] w-full rounded-none" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[230px] rounded-[1.5rem]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="surface-panel space-y-4 p-6 sm:p-8">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-12 w-72 rounded-2xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-3/4 rounded-full" />
          </div>
          <div className="surface-panel space-y-4 p-6 sm:p-8">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-28 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="surface-panel space-y-4 p-6 sm:p-8">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>
          <Skeleton className="h-20 rounded-[1.4rem]" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BookingPageSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="surface-panel space-y-4 p-6 sm:p-8">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-10 w-56 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
      <div className="space-y-6">
        <div className="surface-panel space-y-5 p-6 sm:p-8">
          <Skeleton className="h-10 w-56 rounded-2xl" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl md:col-span-2" />
          </div>
        </div>
        <div className="surface-panel space-y-5 p-6 sm:p-8">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
