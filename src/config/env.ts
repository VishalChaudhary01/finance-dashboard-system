import { getEnv } from "@/common/utils/getEnv";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  AUTH_COOKIE_NAME: getEnv("AUTH_COOKIE_NAME"),
} as const;
