import { Router } from "express";
import { prisma } from "../db";
import { emailQueue } from "../queue/email.queue";


const router = Router();

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

    const email = await prisma.email.create({
      data: {
        userId,
        senderId,
        toEmail,
        subject,
        body,
        scheduledAt: new Date(scheduledAt),
        status: "scheduled",
        idempotencyKey,
      },
    });

    await emailQueue.add("send-email", { emailId: email.id });

    return res.json(email);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
