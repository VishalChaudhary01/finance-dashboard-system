import { z } from "zod";
import { Role, UserStatus } from "@/generated/prisma/enums";

export const nameSchema = z
  .string("Name is required")
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must not exceed 50 characters");

export const emailSchema = z
  .string("Email is required")
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const roleSchema = z.enum([Role.VIEWER, Role.ANALYST, Role.ADMIN], {
  errorMap: () => ({ message: "Role must VIEWER, ANALYST, or ADMIN" }),
});

export const statusSchema = z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE], {
  errorMap: () => ({ message: "User Status must ACTIVE or INACTIVE" }),
});

export const transactionTypeSchema = z.enum(["INCOME", "EXPENSE"], {
  errorMap: () => ({ message: "Type must be INCOME or EXPENSE" }),
});

export const amountSchema = z
  .number("Amount is required")
  .positive("Amount must be a positive number")
  .multipleOf(0.01, "Amount must have at most 2 decimal places");

export const categorySchema = z
  .string("Category is required")
  .trim()
  .min(1, "Category cannot be empty")
  .max(50, "Category must not exceed 50 characters");

export const dateSchema = z
  .string("Date is required")
  .datetime({ message: "Date must be a valid ISO 8601 datetime" })
  .transform((val) => new Date(val));

export const noteSchema = z
  .string()
  .trim()
  .max(500, "Notes must not exceed 500 characters")
  .optional();
