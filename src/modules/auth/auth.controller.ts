import { RequestHandler } from "express";
import { signJWT } from "@/common/utils/jwt";
import { StatusCode } from "@/config/statusCode";
import { clearAuthCookies, setCookie } from "@/common/utils/cookie";
import { signinService, signupService } from "./auth.service";
import { SigninInput, SignupInput } from "@/common/validators/auth.validator";

export const signup: RequestHandler = async (req, res) => {
  const input: SignupInput = req.body;

  const { user } = await signupService(input);

  const { token } = signJWT({ userId: user.id, role: user.role });
  setCookie(res, token);

  res.status(StatusCode.CREATED).json({
    message: "Sign up successful",
  });
};

export const signin: RequestHandler = async (req, res) => {
  const input: SigninInput = req.body;

  const { user } = await signinService(input);

  const { token } = signJWT({ userId: user.id, role: user.role });
  setCookie(res, token);

  res.status(StatusCode.OK).json({
    message: "Sign in successful",
  });
};

export const signout: RequestHandler = async (req, res) => {
  clearAuthCookies(res);

  res.status(StatusCode.OK).json({
    message: "Logout successful",
  });
};
