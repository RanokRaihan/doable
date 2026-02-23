import { cookies } from "next/headers";
import type { TokenResponse } from "./types";
import { buildUrl } from "./utils";

// Mutex to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  } catch {
    return undefined;
  }
}

async function getRefreshToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value;
  } catch {
    return undefined;
  }
}

async function setTokens(
  accessToken: string,
  refreshToken?: string,
): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }
  } catch (error) {
    console.error("Unable to set tokens:", error);
    console.warn("Unable to set tokens - not in server context");
  }
}

async function clearTokens(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  } catch (error) {
    console.error("Unable to clear tokens:", error);
    console.warn("Unable to clear tokens - not in server context");
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      console.log("trying refresh token ", refreshToken);
      if (!refreshToken) {
        await clearTokens();
        return false;
      }

      const url = buildUrl("/auth/refresh-token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });

      if (!response.ok) {
        await clearTokens();
        return false;
      }

      const data: TokenResponse = await response.json();
      console.log("new tokens", {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      });
      if (data.success && data.data.accessToken) {
        await setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }

      await clearTokens();
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await clearTokens();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export {
  clearTokens,
  getAuthToken,
  getRefreshToken,
  refreshAccessToken,
  setTokens,
};
