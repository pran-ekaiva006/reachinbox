import express from "express";
import cors from "cors";
import emailRoutes from "./routes/email.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/emails", emailRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

