import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
if (!redisUrl) {
  throw new Error(
    "Please define the UPSTASH_REDIS_REST_URL environment variable"
  );
}

const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!redisToken) {
  throw new Error(
    "Please define the UPSTASH_REDIS_REST_TOKEN environment variable"
  );
}

// Initialize the Redis client with the URL and token from the environment variables.
const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 d"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export { redis, ratelimit };

// export default redis;
// export { ratelimit };
