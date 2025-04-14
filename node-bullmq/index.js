import "dotenv/config";
import express from "express";
import { emailQueue, queueName } from "./job/sendMailJob.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send-mail", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    await emailQueue.add(queueName, {
      to: to,
      subject: subject,
      body: body,
    });

    return res.status(200).send("Email queued for sending!");
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
