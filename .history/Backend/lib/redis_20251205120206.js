import { Redis } from '@upstash/redis'
import dotenv from 'dotenv';
dotenv.config();

export const redis = new Redis({
 url: process.env.UPSTASH_URL,
 token: process.env.UPSTASH_TOKEN,
})

await redis.set("foo", "bar");
await redis.get("foo");