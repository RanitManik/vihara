import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import express, { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// /api/hotels
const constructSearchQuery = (queryParams: any) => {
  const constructedQuery: any = {};

  if (queryParams.destination) {
    // Escape special regex characters to prevent crashes
    const escapedDestination = queryParams.destination.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    constructedQuery.$or = [
      { city: new RegExp(escapedDestination, "i") },
      { country: new RegExp(escapedDestination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    const adultCount = parseInt(queryParams.adultCount);
    if (!isNaN(adultCount)) {
      constructedQuery.adultCount = { $gte: adultCount };
    }
  }

  if (queryParams.childCount) {
    const childCount = parseInt(queryParams.childCount);
    if (!isNaN(childCount)) {
      constructedQuery.childCount = { $gte: childCount };
    }
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    // Filter out any NaNs
    const validStars = Array.isArray(starRatings)
      ? starRatings.filter((s: number) => !isNaN(s))
      : !isNaN(starRatings)
        ? [starRatings]
        : [];

    if (validStars.length > 0) {
      constructedQuery.starRating = { $in: validStars };
    }
  }

  if (queryParams.maxPrice) {
    const maxPrice = parseInt(queryParams.maxPrice);
    if (!isNaN(maxPrice)) {
      constructedQuery.pricePerNight = {
        $lte: maxPrice, // Pass as number, let Mongoose handle it
      };
    }
  }

  return constructedQuery;
};

// /api/hotels/search
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    // Define the number of hotels to display per page
    const pageSize = 5;

    // Get the page number from query parameters, default to 1 if not provided
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;

    // Calculate the number of documents to skip based on the current page
    const skip = (pageNumber - 1) * pageSize;

    // Fetch hotels from the database with pagination
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Get the total count of hotels for pagination info
    const totalHotels = await Hotel.countDocuments(query);

    // Prepare the response object
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        totalHotels,
        page: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(totalHotels / pageSize),
      },
    };

    // Return the hotels along with pagination info
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something Went Wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

// /api/hotels/:hotelId
router.get(
  "/:hotelId",
  [param("hotelId").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    // Validate the request parameters
    const errors = validationResult(req);

    // If there are validation errors, return a 400 response with the errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Find the hotel by ID
      const hotel = await Hotel.findById(req.params.hotelId.toString());

      // If the hotel is not found, return a 404 response
      if (!hotel) {
        res.status(404).json({ message: "Hotel Not Found" });
        return;
      }

      // Return the hotel details
      res.json(hotel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);

// /api/hotels/:hotelId/bookings/payment-intent
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { numbersOfNights } = req.body;
      const hotelId = req.params.hotelId;

      const hotel = await Hotel.findById(hotelId);

      if (!hotel) {
        res.status(404).json({ message: "Hotel Not Found" });
        return;
      }

      // Stripe expects amount in smallest currency unit (e.g. paise), and as integer
      // Assuming pricePerNight is in INR, multiply by 100 for paise if needed, OR if it's already in base unit, just round.
      // User error says "Invalid integer: 134661.5", implies it's sending a float.
      // NOTE: If pricePerNight is in Rupee, Stripe for INR expects amount in Rupee * 100 (paise).
      // But based on the error "134661.5" which is large, it might already be high.
      // However, typical Stripe integration: amount 1000 = 10.00 currency units.
      // If the error value is 134661.5, and that's rejected, it's just the float nature.
      // I will Math.ceil or Math.round it to ensure integer.
      const totalCost = Math.round(hotel.pricePerNight * numbersOfNights * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost,
        currency: "INR",
        metadata: {
          hotelId,
          userId: req.userId as string,
        },
      });

      if (!paymentIntent.client_secret) {
        res.status(500).json({
          message: "Error creating Payment Intent",
        });
        return;
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
      };

      res.send(response);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
      return;
    }
  },
);

// /api/hotels/:hotelId/bookings
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string,
      );

      if (!paymentIntent) {
        res.status(404).json({ message: "Payment Not Found" });
        return;
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        res.status(404).json({ message: "Payment Intent Mismatch" });
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        res.status(400).json({
          message: `Payment Intent Not Succeeded! Status: ${paymentIntent.status}`,
        });
        return;
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findByIdAndUpdate(
        req.params.hotelId,
        { $push: { bookings: newBooking } },
        { new: true },
      );

      if (!hotel) {
        res.status(404).json({ message: "Hotel Not Found" });
        return;
      }

      res.status(201).json({ booking: newBooking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);

export default router;
