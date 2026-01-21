import { redis } from "./redis";

const GLOBAL_KEY = "email:global:hour";
const SENDER_KEY = (senderId: string) => `email:sender:${senderId}:hour`;

const GLOBAL_LIMIT = Number(process.env.MAX_EMAILS_PER_HOUR || 2);
const SENDER_LIMIT = Number(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || 1);

export async function canSendEmail(): Promise<boolean> {
  const count = await redis.incr(GLOBAL_KEY);
  if (count === 1) {
    await redis.expire(GLOBAL_KEY, 3600);
  }
  return count <= GLOBAL_LIMIT;
}

export async function canSendEmailForSender(senderId: string): Promise<boolean> {
  const key = SENDER_KEY(senderId);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 3600);
  }
  return count <= SENDER_LIMIT;
}
