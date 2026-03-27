"use client";

import { Suspense, useEffect, useState } from "react";
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
import { apiClient } from "@/lib/api-client";
import { HotelSearchResponse } from "@/shared-types";

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsedValue = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

function SearchGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [hotelData, setHotelData] = useState<HotelSearchResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const selectedStars = searchParams.getAll("stars");
  const selectedHotelTypes = searchParams.getAll("types");
  const selectedFacilities = searchParams.getAll("facilities");
  const selectedPrice = parsePositiveInteger(
    searchParams.get("maxPrice"),
    30000,
  );
  const sortOption = searchParams.get("sortOption") || "default";

  const updateSearchParams = (
    updates: Record<string, string | string[] | undefined>,
    {
      resetPage = false,
    }: {
      resetPage?: boolean;
    } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString());

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

    router.replace(`/search?${params.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setIsFetching(true);

      const currentSearchParams = new URLSearchParams(searchParamsString);
      const currentPage = parsePositiveInteger(
        currentSearchParams.get("page"),
        1,
      );
      const currentSelectedStars = currentSearchParams.getAll("stars");
      const currentSelectedHotelTypes = currentSearchParams.getAll("types");
      const currentSelectedFacilities =
        currentSearchParams.getAll("facilities");
      const currentSelectedPrice = parsePositiveInteger(
        currentSearchParams.get("maxPrice"),
        30000,
      );
      const currentSortOption =
        currentSearchParams.get("sortOption") || "default";

      const searchParamsObj: Record<string, string | string[] | undefined> = {
        destination: currentSearchParams.get("destination") || "",
        checkIn: currentSearchParams.get("checkIn") || "",
        checkOut: currentSearchParams.get("checkOut") || "",
        adultCount: currentSearchParams.get("adultCount") || "",
        childCount: currentSearchParams.get("childCount") || "",
        pageNumber: currentPage.toString(),
        stars: currentSelectedStars,
        types: currentSelectedHotelTypes,
        facilities: currentSelectedFacilities,
        maxPrice: currentSelectedPrice.toString(),
        sortOption:
          currentSortOption === "default" ? undefined : currentSortOption,
      };

      const params = new URLSearchParams();

      Object.entries(searchParamsObj).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item));
          return;
        }

        params.append(key, value);
      });

      try {
        const data = await apiClient.get<HotelSearchResponse>(
          `/api/hotels/search?${params.toString()}`,
        );
        setHotelData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchHotels();
  }, [searchParamsString]);

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

  const showResultsSkeleton = isFetching;

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
            <div className="surface-panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] uppercase">
                  {hotelData?.pagination?.totalHotels} Results
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Sort and compare the stays that best fit your pace and budget.
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
                <SelectTrigger className="h-11 w-full rounded-full px-4 sm:w-[240px]">
                  <SelectValue placeholder="Sort by relevance" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="default">Sort by relevance</SelectItem>
                  <SelectItem value="starRating">Highest rating</SelectItem>
                  <SelectItem value="pricePerNightAsc">
                    Price: low to high
                  </SelectItem>
                  <SelectItem value="pricePerNightDesc">
                    Price: high to low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showResultsSkeleton ? <SearchResultsSkeleton /> : null}

            {!showResultsSkeleton &&
              hotelData?.data.map((hotel) => (
                <SearchResultsCard key={hotel._id} hotel={hotel} />
              ))}

            {!showResultsSkeleton && hotelData?.data.length === 0 ? (
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

            {!showResultsSkeleton && hotelData ? (
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
