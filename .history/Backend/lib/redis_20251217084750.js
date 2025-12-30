import dotenv from "dotenv";

// Load .env from backend root
dotenv.config();

const { Redis } = await import("@upstash/redis");

console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "Present ✓" : "Missing ✗");

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

console.log("\nTesting Redis connection...");
try {
  await redis.set("foo", "bar");
  const result = await redis.get("foo");
  console.log("✅ Redis connected successfully! Value:", result);
} catch (error) {
  console.error("❌ Redis connection failed:", error.message);
}