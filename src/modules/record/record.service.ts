import { AppError } from "@/common/utils/appError";
import type {
  CreateRecordInput,
  RecordFilterInput,
  UpdateRecordInput,
} from "@/common/validators/record.validator";
import { ErrorCode } from "@/config/errorCode";
import { prisma } from "@/config/prisma";
import { StatusCode } from "@/config/statusCode";
import { Prisma } from "@/generated/prisma/client";

export const getRecordsService = async (filters: RecordFilterInput) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = filters;

  const skip = (page - 1) * limit;

  const where: Prisma.FinancialRecordWhereInput = {
    isDeleted: false,
    ...(type && { type }),
    ...(category && {
      category: { contains: category, mode: "insensitive" },
    }),
    ...((startDate ?? endDate)
      ? {
          date: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  };

  const [records, total] = await prisma.$transaction([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecordByIdService = async (recordId: string) => {
  const record = await prisma.financialRecord.findUnique({
    where: { id: recordId, isDeleted: false },
  });

  if (!record) {
    throw new AppError(
      "Record not found",
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  return { record };
};

export const createRecordService = async (
  userId: string,
  input: CreateRecordInput,
) => {
  const record = await prisma.financialRecord.create({
    data: {
      ...input,
      createdBy: userId,
    },
  });

  return { record };
};

export const updateRecordService = async (
  recordId: string,
  input: UpdateRecordInput,
) => {
  const recordExists = await prisma.financialRecord.findUnique({
    where: { id: recordId, isDeleted: false },
    select: { id: true },
  });

  if (!recordExists) {
    throw new AppError(
      "Record not found",
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  const record = await prisma.financialRecord.update({
    where: { id: recordId },
    data: input,
  });

  return { record };
};

export const deleteRecordService = async (recordId: string) => {
  const recordExists = await prisma.financialRecord.findUnique({
    where: { id: recordId, isDeleted: false },
    select: { id: true },
  });

  if (!recordExists) {
    throw new AppError(
      "Record not found",
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  // Soft delete
  await prisma.financialRecord.update({
    where: { id: recordId },
    data: { isDeleted: true },
  });
};
