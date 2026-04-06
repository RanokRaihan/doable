import { apiClient, ApiResponse } from "../api";
import { EmailVerificationStatus } from "../types/auth";

const getEmailVerificationStatus =
  async (): Promise<EmailVerificationStatus | null> => {
    try {
      const response = await apiClient.get<
        ApiResponse<EmailVerificationStatus>
      >("/auth/email-verification", {
        cache: "no-store",
      });

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  };

export { getEmailVerificationStatus };
