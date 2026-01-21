import "dotenv/config";
import IORedis from "ioredis";

export const redisConnection = {
  url: process.env.REDIS_URL!,
};

export const redis = new IORedis(process.env.REDIS_URL!);

console.log("Using Redis URL:", process.env.REDIS_URL);
