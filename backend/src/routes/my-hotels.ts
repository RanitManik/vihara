import express, { Request, Response } from "express";
import upload from "@/config/multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "@/models/hotel";

const router = express.Router();

// api/my-hotels
router.post(
    "/",
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            // Extract the hotel data from the request body
            const newHotel: HotelType = req.body;

            /* Upload the images to Cloudinary */

            // Retrieve the uploaded image files from the request
            const imageFiles = req.files as Express.Multer.File[];

            // Map over the image files and create an array of promises to upload each image to Cloudinary
            const uploadPromises = imageFiles.map(async (image) => {
                // Convert the image buffer to a base64 string
                const b64 = Buffer.from(image.buffer).toString("base64");

                // Create a Data URI for the image using its MIME type and base64 data
                const dataURI = "data:" + image.mimetype + ";base64," + b64;

                // Upload the image to Cloudinary and return the URL of the uploaded image
                const res = await cloudinary.v2.uploader.upload(dataURI);

                return res.url;
            });

            const imageUrls = await Promise.all(uploadPromises);

            // create new hotel object and
            // inject the server dependent attributes
            const hotel = new Hotel({
                ...newHotel,
                userId: req.userId,
                imageUrls,
                lastUpdated: new Date(),
            });

            // save the hotel in our database
            await hotel.save();

            // return the success status
            res.status(201).send(hotel);
        } catch (error) {
            // Log any errors that occur during the process
            console.error(error);
            res.status(500).json({ message: "Something Went Wrong" });
        }
    },
);
