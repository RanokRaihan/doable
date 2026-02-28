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

export function isAuthRoute(path: string): boolean {
  return authRoutes.some((route) => matchesRoute(path, route));
}

export function getRequiredRoles(path: string): string[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (matchesRoute(path, route)) {
      return roles;
    }
  }
  return null;
}
