import { StatusCode } from "@/config/statusCode";
import { AppError } from "@/common/utils/appError";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorhandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.log(`Error occured at PATH: ${req.path}`, error);
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, errorCode: error.errorCode });
  }

  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => `${issue.message}`).join(", ");
    return res.status(StatusCode.BAD_REQUEST).json({ message });
  }

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error?.message || "Unknown error occured",
  });
};
