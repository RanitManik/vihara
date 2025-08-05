import express from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "@/routes/users";
import authRoutes from "@/routes/auth";
import cookieParser from "cookie-parser";

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

app.listen(4000, () => {
    console.log("Server started");
});
