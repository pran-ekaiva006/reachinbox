import { Router } from "express";
import { prisma } from "../db.js";
import { emailQueue } from "../queue/email.queue.js";

const router = Router();

/**
 * POST /emails/schedule
 */
router.post("/schedule", async (req, res) => {
  try {
    const {
      userId,
      senderId,
      toEmail,
      subject,
      body,
      scheduledAt,
      idempotencyKey,
    } = req.body;

    if (!idempotencyKey) {
      return res.status(400).json({ error: "idempotencyKey required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: "Invalid userId" });

    const sender = await prisma.sender.findUnique({ where: { id: senderId } });
    if (!sender) return res.status(400).json({ error: "Invalid senderId" });

    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid scheduledAt" });
    }

    const existing = await prisma.email.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      return res.json(existing);
    }

    const email = await prisma.email.create({
      data: {
        userId,
        senderId,
        toEmail,
        subject,
        body,
        scheduledAt: date,
        status: "scheduled",
        idempotencyKey,
      },
    });

    const delay = Math.max(0, date.getTime() - Date.now());

    await emailQueue.add(
      "send-email",
      { emailId: email.id },
      {
        delay,
        attempts: 5,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return res.json(email);
  } catch (err) {
    console.error("Schedule error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/scheduled", async (_req, res) => {
  try {
    const emails = await prisma.email.findMany({
      where: { status: { in: ["scheduled", "sending"] } },
      orderBy: { scheduledAt: "asc" },
    });
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scheduled emails" });
  }
});

router.get("/sent", async (_req, res) => {
  try {
    const emails = await prisma.email.findMany({
      where: { status: "sent" },
      orderBy: { sentAt: "desc" },
    });
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
});

router.get("/metrics", async (_req, res) => {
  const [scheduled, sent, failed] = await Promise.all([
    prisma.email.count({ where: { status: "scheduled" } }),
    prisma.email.count({ where: { status: "sent" } }),
    prisma.email.count({ where: { status: "failed" } }),
  ]);

  res.json({ scheduled, sent, failed });
});

export default router;