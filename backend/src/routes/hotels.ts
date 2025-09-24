import Hotel from "@/models/hotel";
import { HotelSearchResponse } from "@/shared/types";
import express, { Request, Response } from "express";

const router = express.Router();

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
        res.status(500).json({ message: "Something Went Wrong" });
    }
});

const constructSearchQuery = (queryParams: any) => {
    const constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
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

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};

export default router;
