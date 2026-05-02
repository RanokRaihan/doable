import {
  clearTokenCookies,
  decodeToken,
  isTokenExpiringSoon,
  isTokenValid,
  refreshTokens,
  setTokenCookies,
  type RefreshedTokens,
} from "@/lib/auth/proxy-utils";
import {
  getRequiredRoles,
  isAuthRoute,
  isAuthenticatedRoute,
  isOnboardingGatedRoute,
} from "@/lib/auth/routes-utils";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "./actions/common/cookie";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let tokenData = accessToken ? decodeToken(accessToken) : null;

  let isAuthenticated = isTokenValid(tokenData);
  let userRole = tokenData?.role;

  // If access token is missing/expired/expiring-soon but we have a refresh token,
  // attempt to refresh tokens right here in the proxy so that cookies reach the browser.
  let refreshedTokens: RefreshedTokens | null = null;

  if (refreshToken && (!isAuthenticated || isTokenExpiringSoon(tokenData))) {
    refreshedTokens = await refreshTokens(refreshToken);

    if (refreshedTokens) {
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

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return withRefreshedCookies(
        NextResponse.redirect(new URL("/profile", request.url)),
      );
    }
    return NextResponse.next();
  }

  // ─── Authenticated-only routes (any logged-in user, no role check) ───
  if (isAuthenticatedRoute(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (accessToken || refreshToken) {
        clearTokenCookies(response);
      }
      return response;
    }

    // // Redirect away from /verify-email if already verified
    // if (pathname === "/verify-email" && tokenData?.emailVerified === true) {
    //   if (tokenData?.profileStatus === "INCOMPLETE") {
    //     return withRefreshedCookies(
    //       NextResponse.redirect(new URL("/complete-profile", request.url)),
    //     );
    //   }
    //   return withRefreshedCookies(
    //     NextResponse.redirect(new URL("/profile", request.url)),
    //   );
    // }

    // Redirect away from /complete-profile if profile is already complete
    if (
      pathname === "/complete-profile" &&
      tokenData?.profileStatus === "COMPLETE"
    ) {
      return withRefreshedCookies(
        NextResponse.redirect(new URL("/profile", request.url)),
      );
    }

    return withRefreshedCookies(NextResponse.next());
  }

  // ─── Protected routes (role-based) ───
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
      await setCookie("unauthorizedAttempt", "true", { maxAge: 60 });
      return withRefreshedCookies(
        NextResponse.redirect(new URL("/unauthorized", request.url)),
      );
    }

    // ─── Onboarding gate (after role check passes) ───
    if (isOnboardingGatedRoute(pathname)) {
      if (tokenData?.emailVerified === false) {
        const verifyUrl = new URL("/verify-email", request.url);
        verifyUrl.searchParams.set("callbackUrl", pathname);
        return withRefreshedCookies(NextResponse.redirect(verifyUrl));
      }
      if (tokenData?.profileStatus === "INCOMPLETE") {
        const profileUrl = new URL("/complete-profile", request.url);
        profileUrl.searchParams.set("callbackUrl", pathname);
        return withRefreshedCookies(NextResponse.redirect(profileUrl));
      }
    }
  }

  // ─── Default: continue with request ───
  // If tokens were refreshed, forward the new access token as a request header
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
