import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  roleSchema,
  statusSchema,
} from ".";

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
});

export const updateUserSchema = z
  .object({
    role: roleSchema.optional(),
    status: statusSchema.optional(),
  })
  .refine((data) => data.role !== undefined || data.status !== undefined, {
    message: "At least one field (role or status) is required",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
