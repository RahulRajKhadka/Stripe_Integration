// backend/lib/redis.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder (1 level up from lib)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection
console.log("Testing Redis connection...");
await redis.set("foo", "bar");
console.log("✅ Redis connected successfully!");