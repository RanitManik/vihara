import crypto from "crypto";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User, { UserType } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import passport from "passport";
import { env } from "../config/env";
import { authRateLimiter } from "../middleware/rateLimit";
import redisClient from "../config/redis";

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
    failureRedirect: `${env.FRONTEND_URL}/auth`,
  }),
  async (req: Request, res: Response) => {
    const user = req.user as UserType;
    const token = jwt.sign(
      { userId: user._id.toString() },
      env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    // Safari's ITP blocks cookies set during cross-site redirect chains
    // (frontend → Google → backend → frontend). To work around this, we
    // store the JWT in Redis under a short-lived opaque code and redirect
    // the frontend with just that code in the URL. The frontend then
    // exchanges the code via a direct first-party CORS fetch (/oauth-complete),
    // and the cookie is set in that response — which Safari allows.
    const oauthCode = crypto.randomBytes(32).toString("hex");
    await redisClient.set(`oauth:${oauthCode}`, token, "EX", 60);

    res.redirect(`${env.FRONTEND_URL}/auth/callback?oauth_code=${oauthCode}`);
  },
);

// /api/auth/oauth-complete
// Exchanges the short-lived opaque code for the auth_token cookie.
// This endpoint is called via a first-party CORS fetch from the frontend,
// so Safari's ITP does not treat the resulting Set-Cookie as a tracker cookie.
router.get(
  "/oauth-complete",
  authRateLimiter,
  async (req: Request, res: Response) => {
    const { oauth_code } = req.query;

    if (!oauth_code || typeof oauth_code !== "string") {
      res.status(400).json({ message: "Missing or invalid oauth_code" });
      return;
    }

    const redisKey = `oauth:${oauth_code}`;
    const token = await redisClient.get(redisKey);

    if (!token) {
      res
        .status(400)
        .json({
          message: "OAuth code expired or already used. Please sign in again.",
        });
      return;
    }

    // One-time use — delete immediately to prevent replay attacks
    await redisClient.del(redisKey);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400000,
    });

    const decoded = jwt.decode(token) as { userId: string };
    res.status(200).json({ userId: decoded.userId });
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
