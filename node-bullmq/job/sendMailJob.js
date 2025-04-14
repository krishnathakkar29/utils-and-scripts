import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/queue.js";
import nodemailer from "nodemailer";

export const queueName = "sendMailQueue";

export const emailQueue = new Queue(queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    delay: 0,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export const handler = new Worker(
  queueName,
  async (job) => {
    console.log("Processing job:", job.id);
    const data = job.data;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.to,
      subject: data.subject,
      html: data.body, // Use formatted body
    });
  },
  {
    connection: redisConnection,
  }
);

// worker listeners
handler.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});
handler.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});
