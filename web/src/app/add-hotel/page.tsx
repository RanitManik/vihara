"use client";

import ManageHotelForm from "@/components/ManageHotelForm";
import { useCreateMyHotel } from "@/hooks/use-hotels";

export default function AddHotel() {
  const { mutate, isPending } = useCreateMyHotel();

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell">
        <ManageHotelForm onSave={handleSave} isLoading={isPending} />
      </div>
    </main>
  );
}
