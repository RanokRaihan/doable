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
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
};

export const getMyProfileAction = async () =>
  actionHandler(() =>
    apiClient.get<ApiResponse<MyProfile>>("/user/my-profile"),
  );

export type UpdateProfilePayload = {
  name?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  phone?: string;
  bio?: string;
};

export type UpdatedProfile = {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string | null;
  address: string | null;
  phone: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  bio: string | null;
  profileStatus: "INCOMPLETE" | "COMPLETE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

export const updateProfileAction = async (payload: UpdateProfilePayload) => {
  let updatedPayload;
  if (payload.dateOfBirth && !payload.dateOfBirth.includes("T")) {
    updatedPayload = {
      ...payload,
      dateOfBirth: `${payload.dateOfBirth}T00:00:00Z`,
    };
  } else {
    updatedPayload = payload;
  }
  console.log({ updatedPayload });
  return actionHandler(() =>
    apiClient.patch<ApiResponse<UpdatedProfile>>(
      "/user/update-profile",
      updatedPayload,
    ),
  );
};
