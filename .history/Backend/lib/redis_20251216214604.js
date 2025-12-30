import 'dotenv/config';
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection
(async () => {
  try {
    await redis.set('foo', 'bar');
    const result = await redis.get('foo');
    console.log('✅ Redis connected! Value:', result);
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message);
  }
})();
