import { cache } from "react";
import { apiClient } from "../api";
import { LoggedinUser } from "../types/auth";

interface GetMeResponse {
  success: boolean;
  data: LoggedinUser;
}

const getCurrentUser = cache(async (): Promise<LoggedinUser | null> => {
  try {
    const response = await apiClient.get<GetMeResponse>("/auth/current-user", {
      cache: "no-store",
    });

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  } catch {
    return null;
  }
});

export { getCurrentUser };
