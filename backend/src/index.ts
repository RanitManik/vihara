import express from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "@/routes/users";

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);

app.listen(4000, () => {
    console.log("Server started on port 4000");
});
