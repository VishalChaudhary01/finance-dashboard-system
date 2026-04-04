import { AppError } from "@/common/utils/appError";
import { ErrorCode } from "@/config/errorCode";
import { StatusCode } from "@/config/statusCode";
import { Role } from "@/generated/prisma/enums";
import { RequestHandler } from "express";

export const authorize =
  (...allowedRole: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      throw new AppError(
        "Unauthorize",
        StatusCode.UNAUTHORIZED,
        ErrorCode.AUTH_TOKEN_NOT_FOUND,
      );
    }

    if (!allowedRole.includes(req.user.role)) {
      throw new AppError(
        "Insufficient permissions",
        StatusCode.FORBIDDEN,
        ErrorCode.AUTH_UNAUTHORIZED_ACCESS,
      );
    }

    next();
  };
