"use server";

import { LoggedinUser, RegisteredUser } from "@/lib/types/auth";
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
    apiClient.post<ApiResponse<RegisteredUser>>(
      "/user/register/credentials",
      payload,
      {
        skipAuth: true,
      },
    ),
  );

  return result;
};

const logoutAction = async () => {
  try {
    await apiClient.post<ApiResponse<null>>("/auth/logout", {}, { skipAuth: true });
  } catch {
    // Best-effort: local tokens are cleared regardless
  }
  await clearTokens();
  return { success: true };
};

const sendVerificationEmailAction = async () => {
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<null>>("/auth/send-verification-email"),
  );
  return result;
};

type VerifyEmailData = {
  token: string;
};

const verifyEmailAction = async (data: VerifyEmailData) => {
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/verify-email",
      { token: data.token },
      { skipAuth: true },
    ),
  );

  if (result.success && "data" in result && result.data?.accessToken) {
    await setTokens(result.data.accessToken, result.data.refreshToken);
  }

  return result;
};

type CompleteProfileData = {
  dateOfBirth: string;
  phone: string;
  address: string;
  gender: string;
  bio?: string;
};

type CompleteProfileResponse = {
  user: LoggedinUser;
  accessToken: string;
  refreshToken: string;
};

const completeProfileAction = async (data: CompleteProfileData) => {
  const payload = {
    ...data,
    dateOfBirth: `${data.dateOfBirth}T00:00:00Z`,
  };
  const result = await actionHandler(() =>
    apiClient.patch<ApiResponse<CompleteProfileResponse>>(
      "/user/complete-profile",
      payload,
    ),
  );

  if (result.success && "data" in result && result.data?.accessToken) {
    await setTokens(result.data.accessToken, result.data.refreshToken);
  }

  return result;
};

type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
};

const changePasswordAction = async (data: ChangePasswordData) => {
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<null>>("/auth/update-password", data),
  );
  return result;
};

type ForgotPasswordData = {
  email: string;
};

const forgotPasswordAction = async (data: ForgotPasswordData) => {
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<null>>("/auth/forgot-password", data, {
      skipAuth: true,
    }),
  );
  return result;
};

type ResetPasswordData = {
  email: string;
  newPassword: string;
  resetToken: string;
};

const resetPasswordAction = async (data: ResetPasswordData) => {
  const result = await actionHandler(() =>
    apiClient.post<ApiResponse<null>>("/auth/reset-password", data, {
      skipAuth: true,
    }),
  );
  return result;
};

export {
  changePasswordAction,
  completeProfileAction,
  forgotPasswordAction,
  LoginAction,
  logoutAction,
  RegisterAction,
  resetPasswordAction,
  sendVerificationEmailAction,
  verifyEmailAction,
};
