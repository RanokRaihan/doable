import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";

const authRoutes = ["/login", "/register"];
const protectedRoutes: Record<string, string[]> = {
  "/dashboard": ["USER", "ADMIN"],
  "/post-task": ["USER", "ADMIN"],
  "/my-tasks": ["USER", "ADMIN"],
  "/admin*": ["ADMIN"],
};

function matchesRoute(path: string, route: string): boolean {
  if (route.endsWith("*")) {
    return path.startsWith(route.slice(0, -1));
  }
  return path === route || path.startsWith(route + "/");
}

function isAuthRoute(path: string): boolean {
  return authRoutes.some((route) => matchesRoute(path, route));
}

function getRequiredRoles(path: string): string[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (matchesRoute(path, route)) {
      return roles;
    }
  }
  return null;
}

function decodeToken(token: string): { role?: string; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
    return decoded;
  } catch {
    return null;
  }
}

function isTokenValid(tokenData: { exp?: number } | null): boolean {
  return !!(tokenData && tokenData.exp && tokenData.exp * 1000 > Date.now());
}

// Check if the token is expiring soon (within 60 seconds)
function isTokenExpiringSoon(tokenData: { exp?: number } | null): boolean {
  if (!tokenData?.exp) return false;
  const bufferMs = 60 * 1000; // 60 seconds buffer
  return tokenData.exp * 1000 - Date.now() < bufferMs;
}

// Refresh tokens by calling the backend directly from proxy
async function refreshTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
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
      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    }

    return null;
  } catch {
    return null;
  }
}

// Set token cookies on the NextResponse object so they reach the browser
function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
): void {
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}

function clearTokenCookies(response: NextResponse): void {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let tokenData = accessToken ? decodeToken(accessToken) : null;

  let isAuthenticated = isTokenValid(tokenData);
  let userRole = tokenData?.role;

  // If access token is missing/expired/expiring-soon but we have a refresh token,
  // attempt to refresh tokens right here in the proxy so that cookies reach the browser.
  let refreshedTokens: {
    accessToken: string;
    refreshToken?: string;
  } | null = null;

  if (refreshToken && (!isAuthenticated || isTokenExpiringSoon(tokenData))) {
    refreshedTokens = await refreshTokens(refreshToken);

    if (refreshedTokens) {
      // Update local state so routing decisions use the new token
      tokenData = decodeToken(refreshedTokens.accessToken);
      isAuthenticated = isTokenValid(tokenData);
      userRole = tokenData?.role;
    }
  }

  // Helper: attach refreshed cookies to any response we return
  const withRefreshedCookies = (response: NextResponse): NextResponse => {
    if (refreshedTokens) {
      setTokenCookies(
        response,
        refreshedTokens.accessToken,
        refreshedTokens.refreshToken,
      );
    }
    return response;
  };

  // ─── Auth routes (login/register) ───
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return withRefreshedCookies(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    }
    return NextResponse.next();
  }

  // ─── Protected routes ───
  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles) {
    if (!isAuthenticated) {
      // No valid token even after refresh attempt — redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear stale cookies
      if (accessToken || refreshToken) {
        clearTokenCookies(response);
      }
      return response;
    }

    if (!userRole || !requiredRoles.includes(userRole)) {
      return withRefreshedCookies(
        NextResponse.redirect(new URL("/unauthorized", request.url)),
      );
    }
  }

  // ─── Default: continue with request ───
  // If tokens were refreshed, also forward the new access token as a request header
  // so downstream Server Components can use it without reading the (not-yet-set) cookie
  if (refreshedTokens) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-refreshed-access-token", refreshedTokens.accessToken);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    setTokenCookies(
      response,
      refreshedTokens.accessToken,
      refreshedTokens.refreshToken,
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
