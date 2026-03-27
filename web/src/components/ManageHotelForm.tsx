"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BedDouble,
  Images,
  IndianRupee,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { hotelFacilities, hotelTypes } from "@/lib/hotel-options";
import { HotelType } from "@/shared-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

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

type HotelFormSource = HotelType & {
  hotelType?: string | null;
};

const defaultValues: HotelFormData = {
  name: "",
  city: "",
  country: "",
  address: "",
  description: "",
  type: "",
  pricePerNight: 6500,
  starRating: 4,
  facilities: [],
  imageFiles: {} as FileList,
  imageUrls: [],
  adultCount: 2,
  childCount: 0,
};

function normalizeHotelType(type?: string | null) {
  if (!type) {
    return "";
  }

  const normalizedType = type.trim().toLowerCase();

  return (
    hotelTypes.find(
      (option) => option.trim().toLowerCase() === normalizedType,
    ) ?? type
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="bg-primary/12 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-heading text-4xl leading-none font-semibold">
          {title}
        </h2>
      </div>
      <p className="text-muted-foreground text-sm leading-6">{description}</p>
    </div>
  );
}

export default function ManageHotelForm({ onSave, isLoading, hotel }: Props) {
  const form = useForm<HotelFormData>({
    defaultValues,
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const watchedFiles = form.watch("imageFiles");
  const previewFiles = useMemo(
    () => (watchedFiles ? Array.from(watchedFiles) : []),
    [watchedFiles],
  );

  useEffect(() => {
    if (hotel) {
      const hotelData = hotel as HotelFormSource;

      form.reset({
        name: hotelData.name ?? "",
        city: hotelData.city ?? "",
        country: hotelData.country ?? "",
        address: hotelData.address ?? "",
        description: hotelData.description ?? "",
        type: normalizeHotelType(hotelData.type ?? hotelData.hotelType),
        pricePerNight: hotelData.pricePerNight ?? defaultValues.pricePerNight,
        starRating: hotelData.starRating ?? defaultValues.starRating,
        facilities: hotelData.facilities ?? [],
        imageFiles: {} as FileList,
        imageUrls: hotelData.imageUrls ?? [],
        adultCount: hotelData.adultCount ?? defaultValues.adultCount,
        childCount: hotelData.childCount ?? defaultValues.childCount,
      });
      setExistingImages(hotelData.imageUrls ?? []);
      return;
    }

    setExistingImages([]);
  }, [form, hotel]);

  const onSubmit = form.handleSubmit((values) => {
    const formData = new FormData();

    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", values.name);
    formData.append("city", values.city);
    formData.append("country", values.country);
    formData.append("address", values.address);
    formData.append("description", values.description);
    formData.append("type", values.type);
    formData.append("pricePerNight", String(values.pricePerNight));
    formData.append("starRating", String(values.starRating));
    formData.append("adultCount", String(values.adultCount));
    formData.append("childCount", String(values.childCount));

    values.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    existingImages.forEach((url, index) => {
      formData.append(`imageUrls[${index}]`, url);
    });

    if (values.imageFiles) {
      Array.from(values.imageFiles).forEach((imageFile) => {
        formData.append("imageFiles", imageFile);
      });
    }

    onSave(formData);
  });

  const totalImages = existingImages.length + previewFiles.length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <section className="surface-panel p-6 sm:p-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="section-kicker">
                  {hotel ? "Refine your property" : "Create a new listing"}
                </p>
                <h1 className="font-heading text-5xl leading-none font-semibold">
                  {hotel ? "Edit hotel" : "Add hotel"}
                </h1>
                <p className="text-muted-foreground max-w-2xl text-base leading-7">
                  Build a listing that looks premium, feels trustworthy, and
                  makes guests want to book.
                </p>
              </div>
              <Badge className="bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-sm font-semibold">
                {hotel ? "Editing live property" : "Draft listing"}
              </Badge>
            </div>

            <div className="space-y-6">
              <SectionHeader
                icon={MapPin}
                title="Property details"
                description="Set the first impression with a strong title, location, and story."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Property name is required" }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold">
                        Property name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-2xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-2xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-2xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-28 rounded-3xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={8}
                          className="min-h-44 rounded-3xl"
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the atmosphere, standout amenities, and who
                        this stay is best for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>

          <section className="surface-panel p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <SectionHeader
                  icon={Sparkles}
                  title="Position the stay"
                  description="Choose the category, price point, and star level with better controls."
                />

                <Controller
                  control={form.control}
                  name="type"
                  rules={{ required: "Hotel type is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Hotel type
                      </FormLabel>
                      <Select
                        key={field.value || "hotel-type-empty"}
                        value={normalizeHotelType(field.value)}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="h-12 w-full rounded-2xl"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select hotel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hotelTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="starRating"
                  rules={{ required: "Star rating is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Star rating
                      </FormLabel>
                      <Select
                        value={String(field.value || "")}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 w-full rounded-2xl">
                            <SelectValue placeholder="Choose rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num} star{num > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6">
                <Controller
                  control={form.control}
                  name="pricePerNight"
                  rules={{ required: "Price per night is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <FormLabel className="text-sm font-semibold">
                            Price per night
                          </FormLabel>
                          <FormDescription>
                            Position the property from accessible to premium.
                          </FormDescription>
                        </div>
                        <div className="bg-secondary flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold">
                          <IndianRupee className="h-4 w-4" />
                          {Number(field.value || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <FormControl>
                        <Slider
                          min={1500}
                          max={45000}
                          step={500}
                          value={[Number(field.value || 1500)]}
                          onValueChange={([value]) => field.onChange(value)}
                        />
                      </FormControl>
                      <div className="text-muted-foreground flex justify-between text-xs">
                        <span>₹1,500</span>
                        <span>₹45,000</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="adultCount"
                    rules={{ required: "Adult count is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <FormLabel className="text-sm font-semibold">
                              Adults
                            </FormLabel>
                            <FormDescription>
                              Maximum adult occupancy.
                            </FormDescription>
                          </div>
                          <span className="bg-secondary rounded-full px-3 py-1 text-sm font-semibold">
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[Number(field.value || 1)]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="childCount"
                    rules={{ required: "Child count is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <FormLabel className="text-sm font-semibold">
                              Children
                            </FormLabel>
                            <FormDescription>
                              Maximum child occupancy.
                            </FormDescription>
                          </div>
                          <span className="bg-secondary rounded-full px-3 py-1 text-sm font-semibold">
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={8}
                            step={1}
                            value={[Number(field.value || 0)]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="surface-panel p-6 sm:p-8">
            <SectionHeader
              icon={BedDouble}
              title="Facilities"
              description="Show guests what makes the stay comfortable and convenient."
            />

            <Controller
              control={form.control}
              name="facilities"
              rules={{
                validate: (facilities) =>
                  facilities?.length > 0 || "At least one facility is required",
              }}
              render={({ field, fieldState }) => (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {hotelFacilities.map((facility) => {
                      const checked = field.value?.includes(facility) ?? false;

                      return (
                        <label
                          key={facility}
                          className="border-border/70 bg-background/70 flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(nextChecked) => {
                              const nextValues = nextChecked
                                ? [...(field.value || []), facility]
                                : (field.value || []).filter(
                                    (item) => item !== facility,
                                  );
                              field.onChange(nextValues);
                            }}
                          />
                          <span className="text-sm font-medium">
                            {facility}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {fieldState.error ? (
                    <p className="text-sm text-red-600">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </section>

          <section className="surface-panel p-6 sm:p-8">
            <SectionHeader
              icon={Images}
              title="Images"
              description="Keep the gallery clean and curated. You can upload up to 6 images."
            />

            <div className="mt-6 space-y-6">
              {existingImages.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {existingImages.map((url) => (
                    <div
                      key={url}
                      className="surface-panel overflow-hidden p-0 shadow-none"
                    >
                      <div className="relative h-48">
                        <Image
                          src={url}
                          alt="Existing hotel"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-full"
                          onClick={() =>
                            setExistingImages((current) =>
                              current.filter((image) => image !== url),
                            )
                          }
                        >
                          Remove image
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {previewFiles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {previewFiles.map((file) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="border-border/70 bg-background/60 rounded-2xl border border-dashed px-4 py-5 text-sm"
                    >
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-muted-foreground mt-2">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              <FormField
                control={form.control}
                name="imageFiles"
                rules={{
                  validate: (imageFiles) => {
                    const imageCount = imageFiles ? imageFiles.length : 0;
                    const totalLength = imageCount + existingImages.length;

                    if (totalLength === 0) {
                      return "At least one image is required";
                    }

                    if (totalLength > 6) {
                      return "Total number of images cannot be more than 6";
                    }

                    return true;
                  },
                }}
                render={({ field }) => {
                  const { onChange, value, ...inputField } = field;
                  void value;

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Upload images
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...inputField}
                          type="file"
                          multiple
                          accept="image/*"
                          className="h-12 rounded-2xl pt-2"
                          onChange={(event) => onChange(event.target.files)}
                        />
                      </FormControl>
                      <FormDescription>
                        {totalImages} / 6 images selected across existing and
                        new uploads.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              type="submit"
              className="rounded-full px-8 py-6 text-base font-semibold"
            >
              {isLoading
                ? "Saving property..."
                : hotel
                  ? "Update hotel"
                  : "Publish hotel"}
            </Button>
          </div>
        </form>
      </Form>

      <aside className="xl:sticky xl:top-24 xl:h-fit">
        <div className="surface-panel p-6">
          <div className="space-y-4">
            <p className="section-kicker">At a glance</p>
            <h2 className="font-heading text-4xl leading-none font-semibold">
              Listing summary
            </h2>
            <p className="text-muted-foreground text-sm leading-6">
              A quick view of the commercial feel of this property as you edit.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Property
              </p>
              <p className="mt-2 text-base font-semibold">
                {form.watch("name") || "Untitled hotel"}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {[form.watch("city"), form.watch("country")]
                  .filter(Boolean)
                  .join(", ") || "Location not set"}
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Positioning
              </p>
              <p className="mt-2 text-base font-semibold">
                {form.watch("type") || "Type not selected"}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {form.watch("starRating") || 0} star rating
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Pricing
              </p>
              <p className="mt-2 text-base font-semibold">
                ₹
                {Number(form.watch("pricePerNight") || 0).toLocaleString(
                  "en-IN",
                )}{" "}
                / night
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Guest capacity
              </p>
              <p className="mt-2 flex items-center gap-2 text-base font-semibold">
                <Users className="h-4 w-4" />
                {form.watch("adultCount") || 0} adults,{" "}
                {form.watch("childCount") || 0} children
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
