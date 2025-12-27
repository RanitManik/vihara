import express from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { logServerStartup } from "./utils/startup-utils";

const startTime = process.hrtime.bigint();
const expressPackage = require("express/package.json");
const expressVersion = expressPackage.version;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Choose database URI based on environment
const mongoUri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_E2E
    : process.env.MONGODB_URI;

mongoose.connect(mongoUri as string).then(() => {
  const dbType = process.env.NODE_ENV === "test" ? "E2E MongoDB" : "MongoDB";
  console.log(`Successfully connected to ${dbType}`);
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

const port = parseInt(process.env.PORT || "4000", 10);

app.listen(port, () => {
  logServerStartup(port, expressVersion, startTime);
});
