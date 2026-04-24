"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

export type PublicTask = {
  id: string;
  title: string;
  category: string;
  status: string;
  baseCompensation: string;
  location: string;
  createdAt: string;
};

export type PublicReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { id: string; name: string; image: string | null };
};

export type PublicProfile = {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  memberSince: string;
  stats: {
    asPoster: {
      tasksPosted: number;
      averageRating: number | null;
      reviewCount: number;
    };
    asDoer: {
      tasksCompleted: number;
      completionRate: number | null;
      averageRating: number | null;
      reviewCount: number;
    };
  };
  reviews: PublicReview[];
  postedTasks: PublicTask[];
};

export const getPublicProfileAction = async (userId: string) =>
  actionHandler(() =>
    apiClient.get<ApiResponse<PublicProfile>>(`/user/${userId}/public`),
  );
