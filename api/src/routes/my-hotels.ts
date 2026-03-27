import express, { Request, Response } from "express";
import upload from "../config/multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
import type { File as MulterFile } from "multer";

const router = express.Router();

const hotelValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("adultCount")
    .isInt({ min: 1 })
    .withMessage("Adult count must be at least 1"),
  body("childCount")
    .isInt({ min: 0 })
    .withMessage("Child count must be 0 or more"),
  body("facilities")
    .isArray({ min: 1 })
    .withMessage("Facilities must be a non-empty array"),
  body("facilities.*").isString().withMessage("Each facility must be a string"),
  body("pricePerNight")
    .isFloat({ gt: 0 })
    .withMessage("Price per night must be greater than 0"),
  body("starRating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Star rating must be between 1 and 5"),
];

// api/my-hotels
router.post(
  "/",
  verifyToken,
  hotelValidation,
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      // Extract the hotel data from the request body
      const newHotel: HotelType = req.body;

      /* Upload the images to Cloudinary */

      // Retrieve the uploaded image files from the request
      const imageFiles = ((req as any).files as MulterFile[]) || [];

      const imageUrls = await uploadImagesToCloudinary(imageFiles);

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

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.get("/:hotelId", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    res.json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId, userId: req.userId },
        updatedHotel,
        { new: true },
      );

      if (!hotel) {
        res.status(404).json({ message: "Hotel not found" });
        return;
      }

      /* Upload the images to Cloudinary */

      // Retrieve the uploaded image files from the request
      const imageFiles = ((req as any).files as MulterFile[]) || [];

      const updatedImageUrls = await uploadImagesToCloudinary(imageFiles);

      // Append the new image URLs to the existing ones
      hotel.imageUrls = [...updatedImageUrls, ...(hotel.imageUrls || [])];

      await hotel.save();

      // return the success status
      res.status(201).json(hotel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  },
);

async function uploadImagesToCloudinary(imageFiles: MulterFile[]) {
  if (!imageFiles || imageFiles.length === 0) return [];

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
  return imageUrls;
}

export default router;
