import { cookies, headers } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";

// ─── Read-only token access (safe during Server Component render) ───

async function getAuthToken(): Promise<string | undefined> {
  try {
    // First check if the proxy forwarded a refreshed token via request header.
    // This covers the case where the proxy just refreshed the access token —
    // the new cookie isn't readable yet in this request cycle, but the header is.
    const headerStore = await headers();
    const refreshedToken = headerStore.get("x-refreshed-access-token");
    if (refreshedToken) return refreshedToken;

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

// ─── Token refresh ───
// During Server Component rendering, cookies().set() is NOT allowed.
// The proxy (middleware) already handles proactive refresh before the page renders.
// This function is a fallback that:
//   - In Server Actions / Route Handlers: calls backend directly & writes cookies via setTokens()
//   - In Server Components: returns null (proxy should have already refreshed)

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${BACKEND_URL}api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      // Try to write cookies — this will succeed in Server Actions / Route Handlers
      // and silently fail (caught) in Server Components
      try {
        await setTokens(data.data.accessToken, data.data.refreshToken);
      } catch {
        // Cannot write cookies during Server Component render — that's expected.
        // The proxy will handle it on the next request.
      }

      // Return the token in-memory so the current request can retry
      return data.data.accessToken;
    }

    return null;
  } catch {
    return null;
  }
}

export {
  clearTokens,
  getAuthToken,
  getRefreshToken,
  refreshAccessToken,
  setTokens,
};
