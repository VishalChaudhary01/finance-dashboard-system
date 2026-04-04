import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Env } from "./config/env";
import { errorhandler } from "./middlewares/errorHandler";
import { AppError } from "./common/utils/appError";
import { StatusCode } from "./config/statusCode";
import { ErrorCode } from "./config/errorCode";
import { verifyAuth } from "./middlewares/verifyAuth";
import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/user/user.routes";
import recordRoutes from "./modules/record/record.routes";
import { authorize } from "./middlewares/authorize";
import { Role } from "./generated/prisma/enums";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Healthy server!" });
});

app.use("/api/v1/auth", authRoutes);
// ADMIN only
app.use("/api/v1/users", verifyAuth, authorize(Role.ADMIN), userRoutes);
app.use("/api/v1/records", verifyAuth, recordRoutes);

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
