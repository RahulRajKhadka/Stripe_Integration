import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use dynamic import for Upstash Redis
let Redis;
let redis;

try {
  const redisModule = await import("@upstash/redis");
  Redis = redisModule.Redis;
  
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error("❌ Redis environment variables are missing!");
    // Create a mock redis for development
    redis = {
      set: async () => console.log("Mock Redis: set called"),
      get: async () => null
    };
  } else {
    console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);
    console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "Present ✓" : "Missing ✗");
    
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    console.log("\nTesting Redis connection...");
    try {
      await redis.set("test", "connection_working");
      const result = await redis.get("test");
      console.log("✅ Redis connected successfully! Test value:", result);
    } catch (error) {
      console.error("❌ Redis connection failed:", error.message);
      // Fallback to mock
      redis = {
        set: async () => console.log("Mock Redis: set called"),
        get: async () => null
      };
    }
  }
} catch (error) {
  console.error("❌ Failed to import @upstash/redis:", error.message);
  // Fallback to mock
  redis = {
    set: async () => console.log("Mock Redis: set called (fallback)"),
    get: async () => null
  };
}

export { redis };