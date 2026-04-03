import { RequestHandler } from "express";
import { Env } from "@/config/env";
import { verifyJWT } from "@/common/utils/jwt";
import { AppError } from "@/common/utils/appError";
import { ErrorCode } from "@/config/errorCode";
import { Role } from "@/generated/prisma/enums";
import { StatusCode } from "@/config/statusCode";

export const verifyAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies[Env.AUTH_COOKIE_NAME] as string | undefined;
    if (!token) {
      throw new AppError(
        "Token not found",
        StatusCode.UNAUTHORIZED,
        ErrorCode.AUTH_TOKEN_NOT_FOUND,
      );
    }

    const { payload, error } = verifyJWT(token);

    if (error || !payload) {
      throw new AppError(
        "Invalid or expired token",
        StatusCode.UNAUTHORIZED,
        ErrorCode.AUTH_INVALID_TOKEN,
      );
    }

    if (!Object.values(Role).includes(payload.role as Role)) {
      throw new AppError(
        "Invalid token payload",
        StatusCode.UNAUTHORIZED,
        ErrorCode.AUTH_INVALID_TOKEN,
      );
    }

    req.user = {
      id: payload.userId,
      role: payload.role as Role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
