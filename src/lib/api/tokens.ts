import { cookieConfig } from "@/lib/config";
import { cookies, headers } from "next/headers";

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

// ─── Write tokens (ONLY works in Server Actions / Route Handlers) ───

async function setTokens(
  accessToken: string,
  refreshToken?: string,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
    maxAge: cookieConfig.accessTokenMaxAge,
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.refreshTokenMaxAge,
    });
  }
}

async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

export { clearTokens, getAuthToken, setTokens };
