import { redirect } from "next/navigation";
import { LoggedinUser } from "../types/auth";
import { getCurrentUser } from "./getCurrentUser";

type Role = "USER" | "ADMIN";

interface RequireAuthOptions {
  roles?: Role[];
  loginUrl?: string;
  unauthorizedUrl?: string;
  includeCallbackUrl?: boolean;
  callbackUrl?: string;
}

export async function requireAuth(
  options: RequireAuthOptions = {},
): Promise<LoggedinUser> {
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
  return "/profile";
}
