import Redis from "ioredis";
import { env } from "./env";
import logger from "../utils/logger";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  logger.info("🟢 Connected to Redis");
});

redis.on("error", (err) => {
  logger.error("🔴 Redis error:", err);
});

export default redis;
