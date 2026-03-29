import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis";

const store = new RedisStore({
  // @ts-expect-error - ioredis and redis-rate-limit types mismatch but compatible
  sendCommand: (...args: string[]) => redisClient.call(...args),
});

// Default rate limit policy per IP
export const defaultRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  store,
});

// Stricter rate limit for authentication routes
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 login/register attempts per hour
  message: {
    message: "Too many authentication attempts, please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store,
});

export default defaultRateLimiter;
