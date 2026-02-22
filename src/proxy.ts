import { NextRequest, NextResponse } from "next/server";

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
      console.log("Matched protected route:", { route, roles });
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const tokenData = accessToken ? decodeToken(accessToken) : null;

  const isAuthenticated = isTokenValid(tokenData);
  const userRole = tokenData?.role;
  console.log(" Proxy middleware:", {
    pathname,
    isAuthRoute: isAuthRoute(pathname),
    tokenData,
  });
  if (isAuthRoute(pathname)) {
    console.log("yes auth route");
    if (isAuthenticated) {
      console.log("redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const requiredRoles = getRequiredRoles(pathname);
  console.log("required roles", requiredRoles);

  if (requiredRoles) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log("not satisfied,... redirecting");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.png$|.*\.jpg$|.*\.svg$).*)",
  ],
};
