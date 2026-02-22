import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";

type Role = "user" | "admin";

interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  image?: string;
}

interface RequireAuthOptions {
  roles?: Role[];
  loginUrl?: string;
  unauthorizedUrl?: string;
  includeCallbackUrl?: boolean;
  callbackUrl?: string;
}

export async function requireAuth(
  options: RequireAuthOptions = {},
): Promise<User> {
  const {
    roles,
    loginUrl = "/login",
    unauthorizedUrl = "/unauthorized",
    includeCallbackUrl = true,
    callbackUrl,
  } = options;

  const user = await getCurrentUser();

  // Not authenticated - redirect to login
  if (!user) {
    const url = includeCallbackUrl
      ? `${loginUrl}?callbackUrl=${encodeURIComponent(callbackUrl || getCurrentPath())}`
      : loginUrl;
    redirect(url);
  }

  // Check role-based access
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    redirect(unauthorizedUrl);
  }

  return user;
}

function getCurrentPath(): string {
  // In Server Components, we can't easily get the current path
  // The middleware already handles callback URLs, so we return a safe default
  // Or you can pass the path explicitly when needed
  return "/dashboard";
}
