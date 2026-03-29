import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User, { UserType } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import passport from "passport";
import { env } from "../config/env";
import { authRateLimiter } from "../middleware/rateLimit";

const router = express.Router();

// /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// /api/auth/google/callback
router.get(
  "/google/callback",
  authRateLimiter,
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/login`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as UserType;
    const token = jwt.sign(
      { userId: user._id.toString() },
      env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400000,
    });

    res.redirect(`${env.FRONTEND_URL}`);
  },
);

// /api/auth/login
router.post(
  "/login",
  authRateLimiter,
  [
    check("email", "email is required").isEmail(),
    check(
      "password",
      "password with minimum 6 characters is required",
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !user.password) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { userId: user._id.toString() },
        env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        },
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);

// /api/auth/validate-token
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
