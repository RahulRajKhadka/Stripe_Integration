import { Redis } from '@upstash/redis'
const redis = new Redis({
 url:
})

await redis.set("foo", "bar");
await redis.get("foo");