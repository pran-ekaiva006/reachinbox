import { redisConnection } from "./redis";
import IORedis from "ioredis";

const redis = new IORedis(redisConnection.url!);

// Global hourly limit
export async function canSendEmailGlobal(): Promise<boolean> {
  const hour = new Date().toISOString().slice(0, 13);
  const key = `email_global:${hour}`;
  const count = await redis.incr(key);

  if (count === 1) await redis.expire(key, 3600);

  const max = Number(process.env.MAX_EMAILS_PER_HOUR_GLOBAL || 500);
  return count <= max;
}

// Per-sender hourly limit
export async function canSendEmailForSender(senderId: string): Promise<boolean> {
  const hour = new Date().toISOString().slice(0, 13);
  const key = `email_sender:${senderId}:${hour}`;
  const count = await redis.incr(key);

  if (count === 1) await redis.expire(key, 3600);

  const max = Number(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || 50);
  return count <= max;
}
