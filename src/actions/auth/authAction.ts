"use server";

import { apiClient, ApiResponse } from "../../lib/api";
import { actionHandler } from "../../lib/api/actionHandler";
import { setTokens } from "../../lib/api/tokens";

type LoginData = {
  email: string;
  password: string;
  remember?: boolean;
};
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};
type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
const LoginAction = async (loginData: LoginData) => {
  // ignoring "remember" for now, as token handling is done via httpOnly cookies
  const { email, password } = loginData;
  const payload = { email, password };
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/login", payload, {
      skipAuth: true,
      skipRefresh: true,
    }),
  );

  // Set tokens on success
  if (result.success && "data" in result && result.data.accessToken) {
    await setTokens(result.data.accessToken, result.data.refreshToken);
  }

  return result;
};

export { LoginAction };
