import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis";
import { prisma } from "../db";
import { canSendEmailGlobal, canSendEmailForSender } from "../queue/rateLimit";
import { emailQueue } from "../queue/email.queue";
import nodemailer from "nodemailer";

const transporterPromise = nodemailer.createTestAccount().then(acc =>
  nodemailer.createTransport({
    host: acc.smtp.host,
    port: acc.smtp.port,
    secure: acc.smtp.secure,
    auth: { user: acc.user, pass: acc.pass },
  })
);

export const emailWorker = new Worker(
  "email-queue",
  async job => {
    const { emailId } = job.data;

    const email = await prisma.email.findUnique({ where: { id: emailId } });
    if (!email || email.status !== "scheduled") return;

    // Respect scheduled time
    if (email.scheduledAt > new Date()) {
      await emailQueue.add(
        "send-email",
        { emailId },
        { delay: email.scheduledAt.getTime() - Date.now() }
      );
      return;
    }

    // Global limit
    const allowedGlobal = await canSendEmailGlobal();
    if (!allowedGlobal) throw new Error("Global hourly email limit exceeded");

    // Per-sender limit
    const allowedSender = await canSendEmailForSender(email.senderId);
    if (!allowedSender) throw new Error("Sender hourly email limit exceeded");

    // Throttle between sends
    const minDelay = Number(process.env.MIN_DELAY_MS || 2000);
    await new Promise(r => setTimeout(r, minDelay));

    await prisma.email.update({
      where: { id: emailId },
      data: { status: "sending" },
    });

    const transporter = await transporterPromise;
    const info = await transporter.sendMail({
      from: "ReachInbox <no-reply@reachinbox.test>",
      to: email.toEmail,
      subject: email.subject,
      text: email.body,
    });

    await prisma.email.update({
      where: { id: emailId },
      data: { status: "sent", sentAt: new Date() },
    });

    console.log("Preview:", nodemailer.getTestMessageUrl(info));
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);
