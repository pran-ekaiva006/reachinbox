import { Router } from "express";
import { prisma } from "../db.js";
import { emailQueue } from "../queue/email.queue.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * POST /emails/schedule
 */
router.post("/schedule", async (req: AuthRequest, res) => {
  try {
    const {
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

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: req.userEmail! },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: req.userId!,
          email: req.userEmail!,
        },
      });
    }

    // If senderId provided, validate it belongs to user
    let sender;
    if (senderId) {
      sender = await prisma.sender.findFirst({
        where: {
          id: senderId,
          userId: user.id,
        },
      });

      if (!sender) {
        return res.status(400).json({ error: "Invalid senderId" });
      }
    } else {
      // Create or get default sender for user
      sender = await prisma.sender.findFirst({
        where: { userId: user.id },
      });

      if (!sender) {
        sender = await prisma.sender.create({
          data: {
            userId: user.id,
            email: user.email,
            name: user.name || user.email.split("@")[0],
          },
        });
      }
    }

    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid scheduledAt" });
    }

    const existing = await prisma.email.findFirst({
      where: {
        idempotencyKey,
        userId: user.id,
      },
    });

    if (existing) {
      return res.json(existing);
    }

    const email = await prisma.email.create({
      data: {
        userId: user.id,
        senderId: sender.id,
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

router.get("/scheduled", async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.userEmail! },
    });

    if (!user) {
      return res.json([]);
    }

    const emails = await prisma.email.findMany({
      where: {
        userId: user.id,
        status: { in: ["scheduled", "sending"] },
      },
      orderBy: { scheduledAt: "asc" },
    });

    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scheduled emails" });
  }
});

router.get("/sent", async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.userEmail! },
    });

    if (!user) {
      return res.json([]);
    }

    const emails = await prisma.email.findMany({
      where: {
        userId: user.id,
        status: "sent",
      },
      orderBy: { sentAt: "desc" },
    });

    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
});

router.get("/metrics", async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.userEmail! },
    });

    if (!user) {
      return res.json({ scheduled: 0, sent: 0, failed: 0 });
    }

    const [scheduled, sent, failed] = await Promise.all([
      prisma.email.count({ where: { userId: user.id, status: "scheduled" } }),
      prisma.email.count({ where: { userId: user.id, status: "sent" } }),
      prisma.email.count({ where: { userId: user.id, status: "failed" } }),
    ]);

    res.json({ scheduled, sent, failed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

export default router;