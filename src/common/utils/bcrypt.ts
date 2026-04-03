import bcrypt from "bcryptjs";

export const hashValue = async (value: string, saltRounds = 10) =>
  await bcrypt.hash(value, saltRounds);

export const compareValue = async (value: string, hashValue: string) =>
  await bcrypt.compare(value, hashValue);
