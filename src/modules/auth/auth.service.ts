import { prisma } from "@/config/prisma";
import { AppError } from "@/common/utils/appError";
import { StatusCode } from "@/config/statusCode";
import { ErrorCode } from "@/config/errorCode";
import { compareValue, hashValue } from "@/common/utils/bcrypt";
import { omitPassword } from "@/common/utils/omitPassword";
import { SigninInput, SignupInput } from "@/common/validators/auth.validator";

export const signupService = async (input: SignupInput) => {
  const { password, ...rest } = input;

  const userExist = await prisma.user.findFirst({
    where: { email: input.email },
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
  });

  return { user: omitPassword(user) };
};

export const signinService = async (input: SigninInput) => {
  const user = await prisma.user.findFirst({
    where: { email: input.email, status: "ACTIVE" },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  const isPasswordValid = await compareValue(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid Credentials",
      StatusCode.BAD_REQUEST,
      ErrorCode.VALIDATION_ERROR,
    );
  }

  return { user: omitPassword(user) };
};
