import { CookieOptions, Response } from "express";
import { Env } from "@/config/env";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: Env.JWT_SECRET === "production",
  sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 60 * 60 * 1000),
  path: "/",
};

export const setCookie = (res: Response, token: string) =>
  res.cookie(Env.AUTH_COOKIE_NAME, token, cookieOptions);

export const clearAuthCookies = (res: Response): Response =>
  res.clearCookie(Env.AUTH_COOKIE_NAME);
