import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

new Queue("email-queue", {
  connection: redisConnection,
});
export const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
});