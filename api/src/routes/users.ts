import express, { Request, Response } from "express";
import User from "../models/user.js";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

type AuthRequest = Request & { userId?: string };

const router = express.Router();

// Middleware to validate the request
const validateRegister = [
  check("firstName", "First Name is required").isString(),
  check("lastName", "Last Name is required").isString(),
  check("email", "Email is required").isEmail(),
  check("password", "Password must be at least 8 characters long").isLength({
    min: 8,
  }),
];

// /api/users/me
router.get(
  "/me",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    // Assuming user is authenticated and user ID is available in req.userId
    const userId = (req as AuthRequest).userId;

    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  },
);

// /api/users/register
router.post(
  "/register",
  validateRegister,
  async (req: Request, res: Response): Promise<void> => {
    // Validate the request and return errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return;
    }

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" },
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400000,
      });

      res
        .status(201)
        .json({ userId: user._id, message: "User created and logged in." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  },
);

export default router;
