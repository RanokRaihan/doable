import { ApiError } from "./errors";
import { getAuthToken } from "./tokens";
import type { RequestConfig } from "./types";
import {
  buildUrl,
  DEFAULT_TIMEOUT,
  isRetryableError,
  RETRY_DELAY,
  sleep,
} from "./utils";

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {},
): Promise<T> {
  const {
    params,
    headers: customHeaders,
    timeout = DEFAULT_TIMEOUT,
    tags,
    revalidate,
    retries = 0,
    skipAuth = false,
    cache,
  } = config;

  const url = buildUrl(endpoint, params);

  const buildHeaders = (token?: string): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (customHeaders) {
      Object.assign(
        headers,
        customHeaders instanceof Headers
          ? Object.fromEntries(customHeaders.entries())
          : customHeaders,
      );
    }

    return headers;
  };

  const buildFetchOptions = (
    token?: string,
  ): RequestInit & {
    next?: { tags?: string[]; revalidate?: number | false };
  } => {
    const headers = buildHeaders(token);

    const fetchOptions: RequestInit & {
      next?: { tags?: string[]; revalidate?: number | false };
    } = {
      method,
      headers,
    };

    if (body !== undefined && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    if (tags || revalidate !== undefined) {
      fetchOptions.next = {};
      if (tags) fetchOptions.next.tags = tags;
      if (revalidate !== undefined) fetchOptions.next.revalidate = revalidate;
    }

    if (cache) {
      fetchOptions.cache = cache;
    }

    return fetchOptions;
  };

  const executeRequest = async (
    fetchOptions: RequestInit,
  ): Promise<{ response: Response; data: unknown }> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return { response, data: {} };
      }

      let data: unknown;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return { response, data };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  let lastError: Error | null = null;
  let attempt = 0;

  // Get initial token (proxy may have forwarded a refreshed token via header)
  let token: string | undefined;
  if (!skipAuth) {
    token = await getAuthToken();
  }

  while (attempt <= retries) {
    try {
      const fetchOptions = buildFetchOptions(token);
      const { response, data } = await executeRequest(fetchOptions);

      if (!response.ok) {
        // 401 means proxy already tried refresh and it failed — session is truly expired
        if (response.status === 401 && !skipAuth) {
          if (data && typeof data === "object") {
            throw data;
          }
          throw new ApiError("Session expired. Please log in again.", 401);
        }

        // For retryable server errors (5xx, 429), retry before giving up
        if (isRetryableError(null, response.status) && attempt < retries) {
          lastError = new ApiError(
            `Request failed with status ${response.status}`,
            response.status,
          );
          attempt++;
          await sleep(RETRY_DELAY * attempt);
          continue;
        }

        // Pass backend structured error through as-is
        if (data && typeof data === "object") {
          throw data;
        }

        // Fallback for non-JSON error bodies
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status,
        );
      }

      return data as T;
    } catch (error) {
      // Timeout
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      // Backend structured errors & ApiErrors — pass through directly
      if (
        (typeof error === "object" &&
          error !== null &&
          "success" in error &&
          (error as { success: boolean }).success === false) ||
        ApiError.isApiError(error)
      ) {
        throw error;
      }

      // Network errors — retry if possible
      if (isRetryableError(error) && attempt < retries) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;
        await sleep(RETRY_DELAY * attempt);
        continue;
      }

      // Unrecoverable network/unknown error
      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
      );
    }
  }

  throw lastError || new ApiError("Request failed after retries", 500);
}

// Public API Client

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
    request<T>("GET", endpoint, undefined, config),

  post: <T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> => request<T>("POST", endpoint, body, config),

  put: <T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> => request<T>("PUT", endpoint, body, config),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> => request<T>("PATCH", endpoint, body, config),

  delete: <T = void>(endpoint: string, config?: RequestConfig): Promise<T> =>
    request<T>("DELETE", endpoint, undefined, config),
};
