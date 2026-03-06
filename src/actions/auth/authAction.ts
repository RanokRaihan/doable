"use server";

import { LoggedinUser } from "@/lib/types/auth";
import { apiClient, ApiResponse } from "../../lib/api";
import { actionHandler } from "../../lib/api/actionHandler";
import { clearTokens, setTokens } from "../../lib/api/tokens";

type LoginData = {
  email: string;
  password: string;
  remember?: boolean;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginResponse = {
  user: LoggedinUser;
  accessToken: string;
  refreshToken: string;
};
const LoginAction = async (loginData: LoginData) => {
  const { email, password } = loginData;
  const payload = { email, password };
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/login", payload, {
      skipAuth: true,
    }),
  );

  // Set tokens on success
  if (result.success && "data" in result && result.data.accessToken) {
    await setTokens(result.data.accessToken, result.data.refreshToken);
  }

  return result;
};

const RegisterAction = async (registerData: RegisterData) => {
  const { name, email, password } = registerData;
  const payload = { name, email, password };

  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/register", payload, {
      skipAuth: true,
    }),
  );

  // Set tokens on success so user is immediately authenticated after registration.
  if (result.success && "data" in result && result.data.accessToken) {
    await setTokens(result.data.accessToken, result.data.refreshToken);
  }

  return result;
};

const logoutAction = async () => {
  await clearTokens();
  return { success: true };
};
export { LoginAction, logoutAction, RegisterAction };
