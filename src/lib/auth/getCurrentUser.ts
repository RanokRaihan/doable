import { ApiError } from "@/lib/api/errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { apiClient } from "../api";
import { LoggedinUser } from "../types/auth";

interface GetMeResponse {
  success: boolean;
  data: LoggedinUser;
}

const getCurrentUser = cache(async (): Promise<LoggedinUser | null> => {
  let hasSessionCookies = false;
  try {
    const cookieStore = await cookies();
    hasSessionCookies =
      !!cookieStore.get("accessToken")?.value ||
      !!cookieStore.get("refreshToken")?.value;
  } catch {
    // cookies() throws outside request context (static generation) — treat as unauthenticated
  }

  try {
    const response = await apiClient.get<GetMeResponse>("/auth/current-user", {
      cache: "no-store",
    });

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (ApiError.isUnauthorized(error) && hasSessionCookies) {
      // Ghost user: valid JWT locally but backend explicitly rejects it (user not in DB).
      // Route handler clears cookies then redirects to /login.
      redirect("/api/auth/sign-out?redirect=/login");
    }
    // 401 with no cookies = genuinely unauthenticated; 5xx = outage. Both: return null.
    return null;
  }
});

export { getCurrentUser };
