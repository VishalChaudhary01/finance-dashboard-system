import { ZodSchema } from "zod";
import { RequestHandler } from "express";

export const inputValidator =
  (inputSchema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    try {
      inputSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
