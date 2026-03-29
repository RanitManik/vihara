"use client";

import { useParams } from "next/navigation";
import ManageHotelForm from "@/components/ManageHotelForm";
import { useGetHotelById, useUpdateMyHotel } from "@/hooks/use-hotels";

export default function EditHotel() {
  const { hotelId } = useParams();
  const hotelIdStr = hotelId as string;

  const { data: hotel, isLoading: isFetching } = useGetHotelById(hotelIdStr);
  const { mutate, isPending: isUpdating } = useUpdateMyHotel(hotelIdStr);

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  if (isFetching) {
    return (
      <div className="container-shell px-4 py-12 text-center">
        Loading hotel details...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container-shell px-4 py-12 text-center text-red-500">
        Hotel not found.
      </div>
    );
  }

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell">
        <ManageHotelForm
          hotel={hotel}
          onSave={handleSave}
          isLoading={isUpdating}
        />
      </div>
    </main>
  );
}
