"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import { CreatedTask, TaskCategoryType, TaskPriorityType } from "@/lib/types";

export type PostTaskPayload = {
  title: string;
  description: string;
  category: TaskCategoryType;
  priority: TaskPriorityType;
  location: string;
  latitude: number;
  longitude: number;
  baseCompensation: number;
  scheduledAt: string;
  estimatedDuration: number;
  expiresAt?: string;
};

export type TaskImage = {
  id: string;
  url: string;
  altText: string | null;
  taskId: string;
  createdAt: string;
  updatedAt: string;
};

function toIsoDateTime(val: string): string {
  if (!val) return val;
  return new Date(val).toISOString();
}

const postTaskAction = async (data: PostTaskPayload) => {
  const payload = {
    ...data,
    baseCompensation:
      typeof data.baseCompensation === "string"
        ? parseFloat(data.baseCompensation as unknown as string)
        : data.baseCompensation,
    estimatedDuration:
      typeof data.estimatedDuration === "string"
        ? parseInt(data.estimatedDuration as unknown as string, 10)
        : data.estimatedDuration,
    scheduledAt: toIsoDateTime(data.scheduledAt),
    expiresAt: data.expiresAt ? toIsoDateTime(data.expiresAt) : undefined,
  };

  return actionHandler(() =>
    apiClient.post<ApiResponse<CreatedTask>>("/task/post-task", payload),
  );
};

const postTaskImagesAction = async (
  taskId: string,
  images: Array<{ url: string; altText?: string }>,
) => {
  return actionHandler(() =>
    apiClient.post<ApiResponse<TaskImage[]>>(`/task/${taskId}/images`, {
      images,
    }),
  );
};

export { postTaskAction, postTaskImagesAction };
