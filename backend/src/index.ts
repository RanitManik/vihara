import express, { Request, Response } from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (request: Request, res: Response) => {
    res.json({ message: "Hello World!" });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
