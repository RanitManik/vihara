"use client";

import ManageHotelForm from "@/components/ManageHotelForm";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddHotel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (hotelFormData: FormData) => {
    setIsLoading(true);
    try {
      await apiClient.postMultipart("/api/my-hotels", hotelFormData);
      toast.success("Hotel Saved!");
      router.push("/my-hotels");
    } catch (error) {
      toast.error("Error Saving Hotel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
}
