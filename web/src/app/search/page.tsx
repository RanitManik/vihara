"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { apiClient } from "@/lib/api-client";
import { HotelSearchResponse } from "@/shared-types";
import { SearchResultsCard } from "@/components/SearchResultsCard";
import { Pagination } from "@/components/Pagination";
import { StarRatingFilter } from "@/components/StarRatingFilter";
import { HotelTypesFilter } from "@/components/HotelTypesFilter";
import { FacilitiesFilter } from "@/components/FacilitiesFilter";
import { PriceFilter } from "@/components/PriceFilter";
import { FilterSheet } from "@/components/FilterSheet";

function SearchGrid() {
  const searchParams = useSearchParams();
  const [hotelData, setHotelData] = useState<HotelSearchResponse | null>(null);
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    const fetchHotels = async () => {
      const searchParamsObj: any = {
        destination: searchParams.get("destination") || "",
        checkIn: searchParams.get("checkIn") || "",
        checkOut: searchParams.get("checkOut") || "",
        adultCount: searchParams.get("adultCount") || "",
        childCount: searchParams.get("childCount") || "",
        pageNumber: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption,
      };

      const params = new URLSearchParams();
      // Only append valid keys
      Object.keys(searchParamsObj).forEach((key) => {
        if (searchParamsObj[key]) {
          if (Array.isArray(searchParamsObj[key])) {
            searchParamsObj[key].forEach((val: string) =>
              params.append(key, val),
            );
          } else {
            params.append(key, searchParamsObj[key]);
          }
        }
      });

      try {
        const data = await apiClient.get<HotelSearchResponse>(
          `/api/hotels/search?${params.toString()}`,
        );
        setHotelData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHotels();
  }, [
    searchParams,
    page,
    selectedStars,
    selectedHotelTypes,
    selectedFacilities,
    selectedPrice,
    sortOption,
  ]);

  const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prev) =>
      event.target.checked
        ? [...prev, starRating]
        : prev.filter((star) => star !== starRating),
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prev) =>
      event.target.checked
        ? [...prev, hotelType]
        : prev.filter((type) => type !== hotelType),
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prev) =>
      event.target.checked
        ? [...prev, facility]
        : prev.filter((prevFacility) => prevFacility !== facility),
    );
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Mobile Filter Sheet */}
      <FilterSheet>
        <div className="space-y-5">
          <h3 className="border-border border-b pb-5 text-lg font-semibold">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </FilterSheet>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[250px_1fr]">
        <div className="border-border bg-background sticky top-24 hidden h-fit rounded-lg border p-5 lg:block">
          <div className="space-y-5">
            <h3 className="border-border border-b pb-5 text-lg font-semibold">
              Filter by:
            </h3>
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={handleStarChange}
            />
            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={handleHotelTypeChange}
            />
            <FacilitiesFilter
              selectedFacilities={selectedFacilities}
              onChange={handleFacilityChange}
            />
            <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value?: number) => setSelectedPrice(value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">
              {hotelData
                ? `${hotelData.pagination.totalHotels} hotels found`
                : "Finding hotels..."}
              {searchParams.get("destination")
                ? ` in ${searchParams.get("destination")}`
                : ""}
            </span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="rounded-md border p-2 text-sm"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>

          {hotelData?.data.map((hotel) => (
            <SearchResultsCard key={hotel._id} hotel={hotel} />
          ))}

          {hotelData?.data.length === 0 && (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-muted-foreground">
                No hotels found matching your criteria.
              </p>
            </div>
          )}

          {hotelData && (
            <Pagination
              page={hotelData.pagination.page || 1}
              pages={hotelData.pagination.totalPages || 1}
              onPageChange={(page) => setPage(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto p-10">Loading...</div>}
    >
      <SearchGrid />
    </Suspense>
  );
}
