import { cache } from "react";
import { apiClient } from "../api";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  name: string;
  image?: string;
}

interface GetMeResponse {
  success: boolean;
  data: User;
}

const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const response = await apiClient.get<GetMeResponse>("/auth/me", {
      cache: "no-store",
      skipRefresh: false, // Allow token refresh if needed
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
