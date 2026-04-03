export const getEnv = (key: string, defaultValue = "") => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} not set in .env file`);
  }

  return value;
};
