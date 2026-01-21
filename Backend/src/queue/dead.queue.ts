import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const deadQueue = new Queue("dead-email-queue", {
  connection: redisConnection,
});
