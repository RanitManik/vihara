"use client";

import ManageHotelForm from "@/components/ManageHotelForm";
import { apiClient } from "@/lib/api-client";
import { HotelType } from "@/shared-types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      toast.success("Hotel Saved!");
      router.push("/my-hotels");
    } catch (error) {
      toast.error("Error Saving Hotel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hotel) {
    return <div className="container mx-auto p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <ManageHotelForm
        hotel={hotel}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
