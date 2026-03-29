import redisClient from "../config/redis";
import logger from "../utils/logger";

async function clearCache() {
  try {
    logger.info("🧹 Clearing Redis cache...");
    await redisClient.flushdb();
    logger.info("✅ Redis cache cleared successfully.");
  } catch (error) {
    logger.error("❌ Failed to clear Redis cache:", error);
    process.exit(1);
  } finally {
    await redisClient.quit();
  }
}

clearCache();
