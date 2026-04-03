import { ErrorCodeType } from "@/config/errorCode";
import { StatusCode, StatusCodeType } from "@/config/statusCode";

export class AppError extends Error {
  public statusCode: StatusCodeType;
  public errorCode: ErrorCodeType | undefined;

  constructor(
    message: string,
    statusCode: StatusCodeType = StatusCode.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeType,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
