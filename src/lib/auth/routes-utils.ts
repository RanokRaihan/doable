const authRoutes = ["/login", "/register"];

// Routes that require login but no specific role
const authenticatedRoutes = [
  "/change-password",
  "/verify-email",
  "/complete-profile",
];

// Use "/*" suffix for prefix matching, otherwise exact match
const protectedRoutes: Record<string, string[]> = {
  "/profile/*": ["USER", "ADMIN"],
  "/post-task": ["USER", "ADMIN"],
  "/my-tasks": ["USER", "ADMIN"],
  "/admin/*": ["ADMIN"],
};

// Routes that require a verified email AND complete profile
// (subset of protectedRoutes — role check still applies too)
const onboardingGatedRoutes = ["/post-task", "/my-tasks"];

function matchesRoute(path: string, route: string): boolean {
  // Wildcard: "/admin/*" matches "/admin", "/admin/users", etc.
  if (route.endsWith("/*")) {
    const prefix = route.slice(0, -2);
    return path === prefix || path.startsWith(prefix + "/");
  }
  // Exact match only
  return path === route;
}

export function isAuthRoute(path: string): boolean {
  return authRoutes.some((route) => matchesRoute(path, route));
}

export function isAuthenticatedRoute(path: string): boolean {
  return authenticatedRoutes.some((route) => matchesRoute(path, route));
}

export function getRequiredRoles(path: string): string[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (matchesRoute(path, route)) {
      return roles;
    }
  }
  return null;
}

export function isOnboardingGatedRoute(path: string): boolean {
  return onboardingGatedRoutes.some((route) => matchesRoute(path, route));
}
