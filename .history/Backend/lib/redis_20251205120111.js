import { Redis } from '@upstash/redis'
const redis = new Redis({
 
})

await redis.set("foo", "bar");
await redis.get("foo");