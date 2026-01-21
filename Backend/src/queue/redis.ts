import "dotenv/config";

export const redisConnection = {
  url: process.env.REDIS_URL!,
};
console.log("Using Redis URL:", process.env.REDIS_URL);

