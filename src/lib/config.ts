function requiredServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

function optionalIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

export const env = {
  backendUrl: requiredServerEnv("BACKEND_URL"),
  nodeEnv: optionalEnv("NODE_ENV", "development"),
  isProduction: process.env.NODE_ENV === "production",
} as const;

export const cookieConfig = {
  accessTokenMaxAge: optionalIntEnv("ACCESS_TOKEN_MAX_AGE", 15 * 60),
  refreshTokenMaxAge: optionalIntEnv("REFRESH_TOKEN_MAX_AGE", 7 * 24 * 60 * 60),
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  httpOnly: true,
} as const;
