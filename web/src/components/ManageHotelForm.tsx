"use client";

import { useForm, FormProvider } from "react-hook-form";
import { HotelType } from "@/shared-types";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { hotelFacilities, hotelTypes } from "@/lib/hotel-options";
import { cn } from "@/lib/utils";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

export default function ManageHotelForm({ onSave, isLoading, hotel }: Props) {
  const formMethods = useForm<HotelFormData>();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (hotel) {
      reset(hotel);
    }
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    console.log("Form Data Submitted:", formDataJson); // Log the raw form data

    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("address", formDataJson.address);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        {/* DETAILS SECTION */}
        <div className="flex flex-col gap-4">
          <h1 className="mb-3 text-3xl font-bold">
            {hotel ? "Edit Hotel" : "Add Hotel"}
          </h1>

          <Label className="flex flex-col gap-1 text-sm font-bold">
            Name
            <Input
              {...register("name", { required: "This field is required" })}
            />
            {errors.name && (
              <span className="font-normal text-red-500">
                {errors.name.message}
              </span>
            )}
          </Label>

          <div className="flex gap-4">
            <Label className="flex flex-1 flex-col gap-1 text-sm font-bold">
              City
              <Input
                {...register("city", { required: "This field is required" })}
              />
              {errors.city && (
                <span className="font-normal text-red-500">
                  {errors.city.message}
                </span>
              )}
            </Label>
            <Label className="flex flex-1 flex-col gap-1 text-sm font-bold">
              Country
              <Input
                {...register("country", { required: "This field is required" })}
              />
              {errors.country && (
                <span className="font-normal text-red-500">
                  {errors.country.message}
                </span>
              )}
            </Label>
          </div>

          <Label className="flex flex-col gap-1 text-sm font-bold">
            Address
            <Textarea
              {...register("address", { required: "This field is required" })}
            />
            {errors.address && (
              <span className="font-normal text-red-500">
                {errors.address.message}
              </span>
            )}
          </Label>

          <Label className="flex flex-col gap-1 text-sm font-bold">
            Description
            <Textarea
              rows={10}
              {...register("description", {
                required: "This field is required",
              })}
            />
            {errors.description && (
              <span className="font-normal text-red-500">
                {errors.description.message}
              </span>
            )}
          </Label>

          <Label className="flex max-w-[50%] flex-col gap-1 text-sm font-bold">
            Price Per Night
            <Input
              type="number"
              min={1}
              {...register("pricePerNight", {
                required: "This field is required",
              })}
            />
            {errors.pricePerNight && (
              <span className="font-normal text-red-500">
                {errors.pricePerNight.message}
              </span>
            )}
          </Label>
          <Label className="flex max-w-[50%] flex-col gap-1 text-sm font-bold">
            Star Rating
            <select
              {...register("starRating", {
                required: "This field is required",
              })}
              className="w-full rounded border p-2 font-normal text-gray-700"
            >
              <option value="" className="text-sm font-bold">
                Select as Rating
              </option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.starRating && (
              <span className="font-normal text-red-500">
                {errors.starRating.message}
              </span>
            )}
          </Label>
        </div>

        {/* TYPE SECTION */}
        <div className="flex flex-col gap-4">
          <h2 className="mb-3 text-2xl font-bold">Type</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {hotelTypes.map((type) => (
              <label
                key={type}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-center text-sm font-semibold transition-all",
                  watch("type") === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                <input
                  type="radio"
                  value={type}
                  {...register("type", { required: "This field is required" })}
                  className="hidden"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
          {errors.type && (
            <span className="font-bold text-red-500">
              {errors.type.message}
            </span>
          )}
        </div>

        {/* FACILITIES SECTION */}
        <div className="flex flex-col gap-4">
          <h2 className="mb-3 text-2xl font-bold">Facilities</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {hotelFacilities.map((facility) => (
              <label key={facility} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={facility}
                  {...register("facilities", {
                    validate: (facilities) => {
                      if (facilities && facilities.length > 0) {
                        return true;
                      } else {
                        return "At least one facility is required";
                      }
                    },
                  })}
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
          {errors.facilities && (
            <span className="font-bold text-red-500">
              {errors.facilities.message}
            </span>
          )}
        </div>

        {/* GUESTS SECTION */}
        <div className="flex flex-col gap-4">
          <h2 className="mb-3 text-2xl font-bold">Guests</h2>
          <div className="bg-secondary grid grid-cols-2 gap-5 rounded-md px-6 py-10">
            <Label className="flex flex-col gap-1 text-sm font-bold">
              Adults
              <Input
                type="number"
                min={1}
                {...register("adultCount", {
                  required: "This field is required",
                })}
              />
              {errors.adultCount && (
                <span className="font-normal text-red-500">
                  {errors.adultCount.message}
                </span>
              )}
            </Label>
            <Label className="flex flex-col gap-1 text-sm font-bold">
              Children
              <Input
                type="number"
                min={0}
                {...register("childCount", {
                  required: "This field is required",
                })}
              />
              {errors.childCount && (
                <span className="font-normal text-red-500">
                  {errors.childCount.message}
                </span>
              )}
            </Label>
          </div>
        </div>

        {/* IMAGES SECTION */}
        <div className="flex flex-col gap-4">
          <h2 className="mb-3 text-2xl font-bold">Images</h2>
          <div className="flex flex-col gap-4 rounded border p-4">
            {hotel?.imageUrls && (
              <div className="grid grid-cols-6 gap-4">
                {hotel.imageUrls.map((url) => (
                  <div key={url} className="group relative">
                    <img src={url} className="min-h-full object-cover" />
                    <button
                      type="button" // make sure type is button to avoid submitting
                      className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-white opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Input
              type="file"
              multiple
              accept="image/*"
              {...register("imageFiles", {
                validate: (imageFiles) => {
                  const totalLength =
                    imageFiles.length + (hotel?.imageUrls?.length || 0);

                  if (totalLength === 0) {
                    return "At least one image is required";
                  }

                  if (totalLength > 6) {
                    return "Total number of images cannot be more than 6";
                  }

                  return true;
                },
              })}
            />
          </div>
          {errors.imageFiles && (
            <span className="font-bold text-red-500">
              {errors.imageFiles.message}
            </span>
          )}
        </div>

        <span className="flex justify-end">
          <Button
            disabled={isLoading}
            type="submit"
            className="px-10 py-6 text-xl font-bold"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </span>
      </form>
    </FormProvider>
  );
}
