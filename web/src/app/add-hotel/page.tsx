"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import ManageHotelForm from "@/components/ManageHotelForm";
import { apiClient } from "@/lib/api-client";

export default function AddHotel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (hotelFormData: FormData) => {
    setIsLoading(true);

    try {
      await apiClient.postMultipart("/api/my-hotels", hotelFormData);
      toast.success("Hotel saved successfully.");
      router.push("/my-hotels");
    } catch (error) {
      toast.error("Error saving hotel.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="px-4 pt-6 pb-14 sm:px-6 lg:px-8">
      <div className="container-shell">
        <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
      </div>
    </main>
  );
}
