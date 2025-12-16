// test-env.js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, ".env");

console.log("=== Environment Test ===\n");
console.log("Current directory:", __dirname);
console.log("Looking for .env at:", envPath);
console.log(".env file exists:", existsSync(envPath));

if (existsSync(envPath)) {
  console.log("\n--- Raw .env file content ---");
  const content = readFileSync(envPath, "utf8");
  console.log(content);
  console.log("--- End of .env content ---\n");
}

const result = dotenv.config();

console.log("--- Dotenv Result ---");
console.log("Error:", result.error);
console.log("Parsed keys:", result.parsed ? Object.keys(result.parsed) : "none");

console.log("\n--- Environment Variables ---");
console.log("PORT:", process.env.PORT);
console.log("UPSTASH_REDIS_REST_URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("UPSTASH_REDIS_REST_TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN);

console.log("\n--- URL/Token length check ---");
console.log("URL length:", process.env.UPSTASH_REDIS_REST_URL?.length || 0);
console.log("TOKEN length:", process.env.UPSTASH_REDIS_REST_TOKEN?.length || 0);