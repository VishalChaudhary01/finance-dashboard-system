import { StatusCode } from "@/config/statusCode";
import { AppError } from "./appError";
import { ErrorCode } from "@/config/errorCode";

export const getEnv = (key: string, defaultValue = "") => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new AppError(
      `Environment variable ${key} not set in .env file`,
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  return value;
};
