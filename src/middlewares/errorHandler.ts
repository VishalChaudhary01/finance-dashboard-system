import { StatusCode } from "@/config/statusCode";
import { AppError } from "@/utils/appError";
import { ErrorRequestHandler } from "express";

export const errorhandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.log(`Error occured at PATH: ${req.path}`, error);
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, errorCode: error.errorCode });
  }

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error?.message || "Unknown error occured",
  });
};
