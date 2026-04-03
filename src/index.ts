import "dotenv/config";
import express from "express";
import cors from "cors";
import { Env } from "./config/env";

const app = express();
app.use(cors());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Healthy server!" });
});

app.listen(Env.PORT, () =>
  console.log(`Server running at http://localhost:${Env.PORT}`),
);
