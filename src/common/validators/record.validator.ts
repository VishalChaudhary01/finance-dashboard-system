import { z } from "zod";
import {
  amountSchema,
  categorySchema,
  dateSchema,
  noteSchema,
  transactionTypeSchema,
} from ".";

export const createRecordSchema = z.object({
  amount: amountSchema,
  type: transactionTypeSchema,
  category: categorySchema,
  date: dateSchema,
  notes: noteSchema,
});

export const updateRecordSchema = createRecordSchema
  .partial()
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: "At least one field is required to update",
  });

export const recordFilterSchema = z.object({
  type: transactionTypeSchema.optional(),

  category: z.string().trim().optional(),

  startDate: z
    .string()
    .datetime({ message: "startDate must be a valid ISO 8601 datetime" })
    .transform((val) => new Date(val))
    .optional(),

  endDate: z
    .string()
    .datetime({ message: "endDate must be a valid ISO 8601 datetime" })
    .transform((val) => new Date(val))
    .optional(),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, "Page must be at least 1")),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1).max(100, "Limit must not exceed 100")),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordFilterInput = z.infer<typeof recordFilterSchema>;
