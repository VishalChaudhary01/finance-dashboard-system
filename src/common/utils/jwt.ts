import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";
import { Env } from "@/config/env";

type JwtExpiresIn = SignOptions["expiresIn"];

export interface TPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const signJWT = (payload: TPayload, expiresIn: JwtExpiresIn = "1h") => {
  const token = jwt.sign(payload, Env.JWT_SECRET, {
    expiresIn,
  });

  return { token };
};

export const verifyJWT = (token: string) => {
  try {
    const payload = jwt.verify(token, Env.JWT_SECRET) as TPayload;

    return { payload };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unknown error verifying JWT",
    };
  }
};
