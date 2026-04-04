import { AppError } from "@/common/utils/appError";
import { hashValue } from "@/common/utils/bcrypt";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/common/validators/user.validator";
import { ErrorCode } from "@/config/errorCode";
import { prisma } from "@/config/prisma";
import { StatusCode } from "@/config/statusCode";

export const getUsersService = async () => {
  const users = await prisma.user.findMany({ omit: { passwordHash: true } });

  return { users };
};
export const getUserByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { passwordHash: true },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  return { user };
};

export const createUserService = async (input: CreateUserInput) => {
  const { password, ...rest } = input;

  const userExist = await prisma.user.findUnique({
    where: { email: rest.email },
    select: { id: true },
  });

  if (userExist) {
    throw new AppError(
      "User already exist with given email",
      StatusCode.CONFLICT,
      ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
    );
  }

  const hashedPassword = await hashValue(password);

  const user = await prisma.user.create({
    data: {
      ...rest,
      passwordHash: hashedPassword,
    },
    omit: { passwordHash: true },
  });

  return { user };
};

export const updateUserService = async (
  userId: string,
  input: UpdateUserInput,
) => {
  const userExist = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!userExist) {
    throw new AppError(
      "User not found",
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { ...input },
    omit: { passwordHash: true },
  });

  return { user };
};
