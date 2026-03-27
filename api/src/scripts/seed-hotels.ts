import "dotenv/config";
import path from "path";
import { promises as fs } from "fs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import Hotel from "../models/hotel";

const HOTEL_COUNT = parseInt(process.env.SEED_HOTEL_COUNT || "100", 10);
const SEED_USER_ID = process.env.SEED_USER_ID || "seed-user";
const SHOULD_RESET = process.env.SEED_RESET === "true";

const mongoUri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_E2E
    : process.env.MONGODB_URI;

const hotelTypes = [
  "Budget",
  "Boutique",
  "Luxury",
  "Ski Resort",
  "Business",
  "Family",
  "Romantic",
  "Hiking Resort",
  "Cabin",
  "Beach Resort",
  "Golf Resort",
  "Motel",
  "All Inclusive",
  "Pet Friendly",
  "Self Catering",
];

const hotelFacilities = [
  "Free WiFi",
  "Parking",
  "Airport Shuttle",
  "Family Rooms",
  "Non-Smoking",
  "Outdoor Pool",
  "Spa",
  "Fitness Center",
];

const destinations = [
  {
    city: "Jaipur",
    country: "India",
    addresses: ["MI Road", "C-Scheme", "Bani Park", "Civil Lines"],
  },
  {
    city: "Goa",
    country: "India",
    addresses: ["Candolim Beach Road", "Anjuna", "Morjim", "Benaulim"],
  },
  {
    city: "Udaipur",
    country: "India",
    addresses: ["Lake Pichola", "Fateh Sagar", "Sajjangarh Road"],
  },
  {
    city: "Manali",
    country: "India",
    addresses: ["Old Manali", "Hadimba Road", "Naggar Road"],
  },
  {
    city: "Kyoto",
    country: "Japan",
    addresses: ["Gion", "Arashiyama", "Higashiyama"],
  },
  {
    city: "Bali",
    country: "Indonesia",
    addresses: ["Ubud", "Seminyak", "Canggu", "Uluwatu"],
  },
  {
    city: "Santorini",
    country: "Greece",
    addresses: ["Oia", "Fira", "Imerovigli"],
  },
  {
    city: "Dubai",
    country: "UAE",
    addresses: ["Downtown Dubai", "Dubai Marina", "Palm Jumeirah"],
  },
  {
    city: "Paris",
    country: "France",
    addresses: ["Le Marais", "Saint-Germain", "Montmartre"],
  },
  {
    city: "Barcelona",
    country: "Spain",
    addresses: ["Gothic Quarter", "Eixample", "Barceloneta"],
  },
];

const namePrefixes = [
  "Velvet",
  "Aster",
  "Solstice",
  "Cedar",
  "Ivory",
  "Saffron",
  "Harbor",
  "Juniper",
  "Lumen",
  "Terrace",
];

const nameSuffixes = [
  "House",
  "Retreat",
  "Palms",
  "Suites",
  "Villa",
  "Residency",
  "Atelier",
  "Haven",
  "Collection",
  "Court",
];

const descriptionOpeners = [
  "A calm, design-led stay built for travelers who want comfort without clutter.",
  "An atmospheric property with warm interiors, generous rooms, and a slower pace.",
  "A refined stay that balances location, service, and thoughtful amenities.",
  "A memorable base for city breaks, weekend escapes, and longer restorative stays.",
];

const descriptionClosers = [
  "Expect a polished arrival, restful rooms, and easy access to the best parts of the destination.",
  "Ideal for couples, families, and guests who want a little more character in every part of the trip.",
  "The property is shaped around quiet luxury, practical comfort, and an easy booking experience.",
  "It works equally well for quick getaways and longer stays where atmosphere matters.",
];

async function uploadSeedImages() {
  const assetsDirectory = path.resolve(__dirname, "../assets/hotels");
  const assetNames = (await fs.readdir(assetsDirectory))
    .filter((fileName) => /\.(jpg|jpeg|png|webp)$/i.test(fileName))
    .sort();

  if (assetNames.length === 0) {
    throw new Error("No hotel seed images found in api/src/assets/hotels");
  }

  const uploadedUrls = await Promise.all(
    assetNames.map(async (fileName) => {
      const filePath = path.join(assetsDirectory, fileName);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "vihara-seed-hotels",
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      return result.secure_url;
    }),
  );

  return uploadedUrls;
}

function buildHotel(index: number, imageUrls: string[]) {
  const destination = destinations[index % destinations.length];
  const type = hotelTypes[index % hotelTypes.length];
  const prefix = namePrefixes[index % namePrefixes.length];
  const suffix = nameSuffixes[(index + 3) % nameSuffixes.length];
  const address =
    destination.addresses[index % destination.addresses.length] ||
    `${12 + index} Central Avenue`;

  const firstImage = imageUrls[index % imageUrls.length];
  const secondImage = imageUrls[(index + 1) % imageUrls.length];
  const thirdImage = imageUrls[(index + 2) % imageUrls.length];

  const selectedFacilities = hotelFacilities
    .filter((_, facilityIndex) => {
      return (facilityIndex + index) % 2 === 0 || facilityIndex < 3;
    })
    .slice(0, 5);

  return {
    userId: SEED_USER_ID,
    name: `${prefix} ${destination.city} ${suffix}`,
    city: destination.city,
    country: destination.country,
    address: `${address}, ${destination.city}`,
    description: `${descriptionOpeners[index % descriptionOpeners.length]} ${descriptionClosers[index % descriptionClosers.length]}`,
    type,
    adultCount: 2 + (index % 4),
    childCount: index % 3,
    facilities: selectedFacilities,
    pricePerNight: 4500 + (index % 12) * 1250,
    imageUrls: [firstImage, secondImage, thirdImage],
    starRating: 3 + (index % 3),
    lastUpdated: new Date(),
    bookings: [],
  };
}

async function seedHotels() {
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI or MONGODB_URI_E2E");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  await mongoose.connect(mongoUri);

  if (SHOULD_RESET) {
    await Hotel.deleteMany({ userId: SEED_USER_ID });
  }

  const uploadedImageUrls = await uploadSeedImages();
  const hotels = Array.from({ length: HOTEL_COUNT }, (_, index) =>
    buildHotel(index, uploadedImageUrls),
  );

  const insertedHotels = await Hotel.insertMany(hotels);

  console.log(
    `Seeded ${insertedHotels.length} hotels for user "${SEED_USER_ID}".`,
  );
}

seedHotels()
  .catch((error) => {
    console.error("Hotel seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
