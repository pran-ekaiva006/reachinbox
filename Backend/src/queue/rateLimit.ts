import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

const rateLimitQueue = new Queue("rate-limit", {
  connection: redisConnection,
});

/**
 * Global hourly email limit
 */
export async function canSendEmailGlobal(): Promise<boolean> {
  const hour = new Date().toISOString().slice(0, 13);
  const key = `email_global:${hour}`;

  const client = await rateLimitQueue.client;
  const count = await client.incr(key);

  if (count === 1) {
    await client.expire(key, 3600);
  }

  const max = Number(process.env.MAX_EMAILS_PER_HOUR_GLOBAL || 500);
  return count <= max;
}

/**
 * Per-sender hourly email limit
 */
export async function canSendEmailForSender(senderId: string): Promise<boolean> {
  const hour = new Date().toISOString().slice(0, 13);
  const key = `email_sender:${senderId}:${hour}`;

  const client = await rateLimitQueue.client;
  const count = await client.incr(key);

  if (count === 1) {
    await client.expire(key, 3600);
  }

  const max = Number(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || 50);
  return count <= max;
}