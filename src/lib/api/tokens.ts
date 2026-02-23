import { cookies } from "next/headers";

// ─── Read-only token access (safe during Server Component render) ───

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

// ─── Write tokens (ONLY works in Server Actions / Route Handlers) ───

async function setTokens(
  accessToken: string,
  refreshToken?: string,
): Promise<void> {
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
}

async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

// ─── Token refresh (safe during render — delegates cookie writes to Route Handler) ───

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      // Call internal Route Handler — it CAN write cookies
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) return null;

      const data: { success: boolean; data?: { accessToken: string } } =
        await response.json();

      if (data.success && data.data?.accessToken) {
        return data.data.accessToken;
      }

      return null;
    } catch {
      return null;
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
