import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const deadQueue = new Queue("dead-email-queue", {
  connection: redisConnection,
});