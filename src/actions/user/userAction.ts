"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";

export type MyProfile = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  profileStatus: "INCOMPLETE" | "COMPLETE" | "SUSPENDED";
  provider: "CREDENTIALS" | "GOOGLE";
  image: string | null;
  emailVerified: boolean;
};

export const getMyProfileAction = async () =>
  actionHandler(() =>
    apiClient.get<ApiResponse<MyProfile>>("/user/my-profile"),
  );
