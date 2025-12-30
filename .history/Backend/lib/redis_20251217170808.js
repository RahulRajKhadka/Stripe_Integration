// backend/lib/redis.js
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";

dotenv.config(); // loads .env from project root

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// quick test
(async () => {
  try {
    await redis.set("foo", "bar");
    const value = await redis.get("foo");
    console.log("✅ Redis connected:", value);
  } catch (err) {
    console.error("❌ Redis error:", err.message);
  }
})();
