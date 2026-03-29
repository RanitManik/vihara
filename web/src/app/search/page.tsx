"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FacilitiesFilter } from "@/components/FacilitiesFilter";
import { FilterSheet } from "@/components/FilterSheet";
import { HotelTypesFilter } from "@/components/HotelTypesFilter";
import { SearchResultsSkeleton } from "@/components/PageSkeletons";
import { Pagination } from "@/components/Pagination";
import { PriceFilter } from "@/components/PriceFilter";
import { SearchBar } from "@/components/SearchBar";
import { SearchResultsCard } from "@/components/SearchResultsCard";
import { StarRatingFilter } from "@/components/StarRatingFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchHotels } from "@/hooks/use-hotels";

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsedValue = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

function SearchGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state to track filter changes before pushing to URL
  const [pendingParams, setPendingParams] = useState<URLSearchParams | null>(
    null,
  );

  // Debounce pushing pendingParams to the URL
  useEffect(() => {
    if (!pendingParams) return;

    // If pending matches current searchParams, we can clear the pending state.
    // We use a small timeout to avoid the synchronous setState warning while
    // still providing the same functional behavior of resetting the pending state.
    if (pendingParams.toString() === searchParams.toString()) {
      const resetTimer = setTimeout(() => {
        setPendingParams(null);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const pushTimer = setTimeout(() => {
      router.replace(`/search?${pendingParams.toString()}`, {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(pushTimer);
  }, [pendingParams, router, searchParams]);

  // Use either pendingParams (if user is actively filtering) or searchParams
  const activeParams = pendingParams || searchParams;

  // Create a stable string representation for useMemo
  const activeParamsString = activeParams.toString();

  // Create the API search params
  const apiSearchParams = useMemo(() => {
    const params = new URLSearchParams();
    const currentParams = new URLSearchParams(activeParamsString);

    params.append("destination", currentParams.get("destination") || "");
    params.append("checkIn", currentParams.get("checkIn") || "");
    params.append("checkOut", currentParams.get("checkOut") || "");
    params.append("adultCount", currentParams.get("adultCount") || "");
    params.append("childCount", currentParams.get("childCount") || "");
    params.append("pageNumber", currentParams.get("page") || "1");

    currentParams
      .getAll("stars")
      .forEach((star) => params.append("stars", star));
    currentParams
      .getAll("types")
      .forEach((type) => params.append("types", type));
    currentParams
      .getAll("facilities")
      .forEach((facility) => params.append("facilities", facility));

    const maxPrice = currentParams.get("maxPrice");
    if (maxPrice) params.append("maxPrice", maxPrice);

    const sortOptionParam = currentParams.get("sortOption");
    if (sortOptionParam && sortOptionParam !== "default") {
      params.append("sortOption", sortOptionParam);
    }
    return params;
  }, [activeParamsString]);

  const {
    data: hotelData,
    isLoading,
    isFetching,
  } = useSearchHotels(apiSearchParams);

  const selectedStars = activeParams.getAll("stars");
  const selectedHotelTypes = activeParams.getAll("types");
  const selectedFacilities = activeParams.getAll("facilities");
  const selectedPrice = parsePositiveInteger(
    activeParams.get("maxPrice"),
    30000,
  );
  const sortOption = activeParams.get("sortOption") || "default";

  const updateSearchParams = (
    updates: Record<string, string | string[] | undefined>,
    {
      resetPage = false,
    }: {
      resetPage?: boolean;
    } = {},
  ) => {
    const params = new URLSearchParams(activeParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key);

      if (!value || (Array.isArray(value) && value.length === 0)) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
        return;
      }

      params.set(key, value);
    });

    if (resetPage) {
      params.set("page", "1");
    } else if (!params.get("page")) {
      params.set("page", "1");
    }

    if (params.toString() === searchParams.toString()) {
      setPendingParams(null);
    } else {
      setPendingParams(params);
    }
  };

  const toggleValue = (
    key: "stars" | "types" | "facilities",
    value: string,
    checked: boolean,
    items: string[],
  ) => {
    updateSearchParams(
      {
        [key]: checked
          ? [...items, value]
          : items.filter((item) => item !== value),
      },
      {
        resetPage: true,
      },
    );
  };

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell space-y-6">
        <section className="space-y-4">
          <SearchBar />
          {/* <div className="surface-panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Search results</p>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                Adjust destination, dates, guests, and filters without leaving
                the shortlist.
              </p>
            </div>
            <div className="bg-secondary text-secondary-foreground inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" />
              {hotelData
                ? `${hotelData.pagination.totalHotels} stays available`
                : "Finding the best matches"}
            </div>
          </div> */}
        </section>

        <FilterSheet>
          <div className="space-y-4">
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={(value, checked) =>
                toggleValue("stars", value, checked, selectedStars)
              }
            />
            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={(value, checked) =>
                toggleValue("types", value, checked, selectedHotelTypes)
              }
            />
            <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value) =>
                updateSearchParams(
                  {
                    maxPrice: value?.toString(),
                  },
                  {
                    resetPage: true,
                  },
                )
              }
            />
            <FacilitiesFilter
              selectedFacilities={selectedFacilities}
              onChange={(value, checked) =>
                toggleValue("facilities", value, checked, selectedFacilities)
              }
            />
          </div>
        </FilterSheet>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:items-start">
          <aside className="surface-panel hidden p-6 lg:block">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="section-kicker">Control the shortlist</p>
                <h3 className="font-heading text-3xl leading-none font-semibold">
                  Refine your search
                </h3>
                <p className="text-muted-foreground text-sm leading-6">
                  Premium stays, clearer filters, and less browser-default
                  chaos.
                </p>
              </div>
              <StarRatingFilter
                selectedStars={selectedStars}
                onChange={(value, checked) =>
                  toggleValue("stars", value, checked, selectedStars)
                }
              />
              <HotelTypesFilter
                selectedHotelTypes={selectedHotelTypes}
                onChange={(value, checked) =>
                  toggleValue("types", value, checked, selectedHotelTypes)
                }
              />
              <PriceFilter
                selectedPrice={selectedPrice}
                onChange={(value) =>
                  updateSearchParams(
                    {
                      maxPrice: value?.toString(),
                    },
                    {
                      resetPage: true,
                    },
                  )
                }
              />
              <FacilitiesFilter
                selectedFacilities={selectedFacilities}
                onChange={(value, checked) =>
                  toggleValue("facilities", value, checked, selectedFacilities)
                }
              />
            </div>
          </aside>

          <section className="space-y-5">
            <div
              className={`space-y-5 transition-opacity duration-200 ${
                isFetching && !isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {isLoading ? (
                <SearchResultsSkeleton />
              ) : (
                <>
                  <div className="surface-panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.18em] uppercase">
                        {hotelData?.pagination?.totalHotels ?? 0} Results
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Sort and compare the stays that best fit your pace and
                        budget.
                      </p>
                    </div>
                    <Select
                      value={sortOption}
                      onValueChange={(value) =>
                        updateSearchParams(
                          {
                            sortOption: value === "default" ? undefined : value,
                          },
                          {
                            resetPage: true,
                          },
                        )
                      }
                    >
                      <SelectTrigger className="h-11 w-full rounded-full px-4 sm:w-60">
                        <SelectValue placeholder="Sort by relevance" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="default">
                          Sort by relevance
                        </SelectItem>
                        <SelectItem value="starRating">
                          Highest rating
                        </SelectItem>
                        <SelectItem value="pricePerNightAsc">
                          Price: low to high
                        </SelectItem>
                        <SelectItem value="pricePerNightDesc">
                          Price: high to low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {hotelData?.data.map((hotel) => (
                    <SearchResultsCard key={hotel._id} hotel={hotel} />
                  ))}

                  {hotelData?.data.length === 0 ? (
                    <div className="surface-panel flex min-h-72 items-center justify-center p-8 text-center">
                      <div className="space-y-3">
                        <h2 className="font-heading text-4xl leading-none font-semibold">
                          No hotels matched this search.
                        </h2>
                        <p className="text-muted-foreground max-w-md text-sm leading-6">
                          Try widening the price cap, removing a few filters, or
                          searching a nearby destination.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {hotelData ? (
                    <Pagination
                      page={hotelData.pagination.page || 1}
                      pages={hotelData.pagination.totalPages || 1}
                      onPageChange={(nextPage) =>
                        updateSearchParams({
                          page: nextPage.toString(),
                        })
                      }
                    />
                  ) : null}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="container-shell px-4 py-12">Loading...</div>}
    >
      <SearchGrid />
    </Suspense>
  );
}
