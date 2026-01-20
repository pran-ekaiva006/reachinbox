import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

router.post("/schedule", async (req: Request, res: Response) => {
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

    if (!scheduledAt) {
      return res.status(400).json({ error: "scheduledAt required" });
    }

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

    return res.json(email);
  } catch (err) {
    console.error("Schedule email error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
