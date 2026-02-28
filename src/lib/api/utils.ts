import { env } from "@/lib/config";

const BASE_URL = env.backendUrl;

export const DEFAULT_TIMEOUT = 30000;
export const RETRY_DELAY = 1000;

export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const url = new URL(`api/v1${endpoint}`, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function isRetryableError(error: unknown, status?: number): boolean {
  if (status && (status >= 500 || status === 429)) return true;
  if (error instanceof TypeError) return true;
  return false;
}
