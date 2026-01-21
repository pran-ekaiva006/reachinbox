import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis";
import { prisma } from "../db";
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
