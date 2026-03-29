"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { HotelType } from "@/shared-types";

export type LovedHotel = {
  _id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  imageUrls: string[];
  type: string;
  starRating: number;
};

export const useGetHotels = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: () => apiClient.get<HotelType[]>("/api/hotels"),
  });
};
