import "dotenv/config";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redisConnection = {
  url: process.env.REDIS_URL,
};