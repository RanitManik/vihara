import express, { Request, Response } from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import passport from "./config/passport";
import { env } from "./config/env";
import { logServerStartup } from "./utils/startup-utils";
import redisClient from "./config/redis";
import logger from "./utils/logger";

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import rateLimiter from "./middleware/rateLimit";

const startTime = process.hrtime.bigint();
const expressPackage = require("express/package.json");
const expressVersion = expressPackage.version;

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Choose database URI based on environment
const mongoUri =
  env.NODE_ENV === "test" ? env.MONGODB_URI_E2E : env.MONGODB_URI;

mongoose.connect(mongoUri as string).then(() => {
  const dbType = env.NODE_ENV === "test" ? "E2E MongoDB" : "MongoDB";
  logger.info(`🟢 Successfully connected to ${dbType}`);
});

const app = express();

// Trust the first proxy (e.g. Nginx, Heroku, etc.)
app.set("trust proxy", 1);

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// Logging Middleware
app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Rate Limiting
app.use(rateLimiter);

// Parsing Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10kb" })); // Body limit for security
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Passport
app.use(passport.initialize());

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err: Error & { status?: number }, _req: Request, res: Response) => {
  logger.error("🔴 Global Error Handler:", err);

  const status = err.status || 500;
  const message =
    env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(status).json({
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const port = parseInt(env.PORT, 10);

const server = app.listen(port, () => {
  logServerStartup(port, expressVersion, startTime);
});

// Graceful Shutdown
const shutdown = async () => {
  logger.info("🟡 Shutting down gracefully...");

  server.close(async () => {
    logger.info("HTTP server closed.");

    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed.");

      await redisClient.quit();
      logger.info("Redis connection closed.");

      process.exit(0);
    } catch (err) {
      logger.error("Error during shutdown:", err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
