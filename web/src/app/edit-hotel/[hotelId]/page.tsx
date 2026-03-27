"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import ManageHotelForm from "@/components/ManageHotelForm";
import { apiClient } from "@/lib/api-client";
import { HotelType } from "@/shared-types";

export default function EditHotel() {
  const { hotelId } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await apiClient.get<HotelType>(
          `/api/my-hotels/${hotelId as string}`,
        );
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel details", error);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const handleSave = async (hotelFormData: FormData) => {
    setIsLoading(true);

    try {
      await apiClient.putMultipart(`/api/my-hotels/${hotelId}`, hotelFormData);
      toast.success("Hotel updated successfully.");
      router.push("/my-hotels");
    } catch (error) {
      toast.error("Error saving hotel.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hotel) {
    return <div className="container-shell px-4 py-12">Loading...</div>;
  }

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell">
        <ManageHotelForm
          hotel={hotel}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
