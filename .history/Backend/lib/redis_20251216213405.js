// backend/lib/redis.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Import Redis AFTER dotenv is configured
const { Redis } = await import("@upstash/redis");

// Debug logs
console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "Present" : "Missing");

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection
console.log("Testing Redis connection...");
try {
  await redis.set("foo", "bar");
  const result = await redis.get("foo");
  console.log("✅ Redis connected successfully! Value:", result);
} catch (error) {
  console.error("❌ Redis connection failed:", error.message);
}