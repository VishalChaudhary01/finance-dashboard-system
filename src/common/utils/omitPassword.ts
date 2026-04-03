import { User } from "@/generated/prisma/client";

export const omitPassword = (user: User) => {
  const { passwordHash, ...rest } = user;
  return rest;
};
