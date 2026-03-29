"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { HotelSearchResponse, HotelType } from "@/shared-types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSearchHotels = (queryParams: URLSearchParams) => {
  return useQuery({
    queryKey: ["search-hotels", queryParams.toString()],
    queryFn: () =>
      apiClient.get<HotelSearchResponse>(`/api/hotels/search?${queryParams}`),
  });
};

export const useGetHotelById = (hotelId: string) => {
  return useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => apiClient.get<HotelType>(`/api/hotels/${hotelId}`),
    enabled: !!hotelId,
  });
};

export const useGetMyHotels = () => {
  return useQuery({
    queryKey: ["my-hotels"],
    queryFn: () => apiClient.get<HotelType[]>("/api/my-hotels"),
  });
};

export const useGetMyBookings = () => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => apiClient.get<HotelType[]>("/api/my-bookings"),
  });
};

export const useCreateMyHotel = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hotelFormData: FormData) =>
      apiClient.postMultipart("/api/my-hotels", hotelFormData),
    onSuccess: () => {
      toast.success("Hotel Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] });
      router.push("/my-hotels");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateMyHotel = (hotelId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (hotelFormData: FormData) =>
      apiClient.putMultipart(`/api/my-hotels/${hotelId}`, hotelFormData),
    onSuccess: () => {
      toast.success("Hotel Updated Successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-hotels", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["my-hotels"] });
      router.push("/my-hotels");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
type BookingData = {
  paymentIntentId: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  totalCost: number;
};

export const useCreateBooking = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: BookingData) =>
      apiClient.post(`/api/hotels/${hotelId}/bookings`, bookingData),
    onSuccess: () => {
      toast.success("Booking Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCreatePaymentIntent = (hotelId: string) => {
  return useMutation({
    mutationFn: (numberOfNights: string) =>
      apiClient.post<{ clientSecret: string }>(
        `/api/hotels/${hotelId}/bookings/payment-intent`,
        { numberOfNights },
      ),
  });
};
