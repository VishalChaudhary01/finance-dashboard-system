import { getEnv } from "@/utils/getEnv";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
} as const;
