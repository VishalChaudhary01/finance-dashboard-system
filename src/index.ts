import "dotenv/config";
import express from "express";
import cors from "cors";
import { Env } from "./config/env";
import { errorhandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/appError";
import { StatusCode } from "./config/statusCode";
import { ErrorCode } from "./config/errorCode";

const app = express();
app.use(cors());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Healthy server!" });
});

app.use((req, _res, _next) => {
  throw new AppError(
    `API Route ${req.path} not found`,
    StatusCode.NOT_FOUND,
    ErrorCode.RESOURCE_NOT_FOUND,
  );
});

app.use(errorhandler);

app.listen(Env.PORT, () =>
  console.log(`Server running at http://localhost:${Env.PORT}`),
);
