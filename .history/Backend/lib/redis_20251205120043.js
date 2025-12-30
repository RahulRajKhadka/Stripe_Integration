import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: 'https://noble-fowl-12653.upstash.io',
  token: 'ATFtAAIncDJhZGEwOGJjZjk5MWQ0ZmU0YWNjNTk3YTZkNjgwNTA2MXAyMTI2NTM',
})

await redis.set("foo", "bar");
await redis.get("foo");