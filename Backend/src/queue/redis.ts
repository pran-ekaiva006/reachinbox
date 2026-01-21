import IORedis from "ioredis";

export const redisConnection = {
  url: process.env.REDIS_URL!,
};
