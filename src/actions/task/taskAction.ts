"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import {
  CreatedTask,
  MyPostedTask,
  TaskCategoryType,
  TaskDetails,
  TaskImage,
  TaskPriorityType,
  TasksResponse,
  SortField,
  SortOrder,
  TaskStatusType,
} from "@/lib/types";

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

function toIsoDateTime(val: string): string {
  if (!val) return val;
  return new Date(val).toISOString();
}

const postTaskAction = async (data: PostTaskPayload) => {
  const payload = {
    ...data,
    baseCompensation:
      typeof data.baseCompensation === "string"
        ? parseFloat(data.baseCompensation as string)
        : data.baseCompensation,
    estimatedDuration:
      typeof data.estimatedDuration === "string"
        ? parseInt(data.estimatedDuration as string, 10)
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
    apiClient.post<ApiResponse<TaskImage[]>>(`/task/${taskId}/image`, {
      images,
    }),
  );
};

const getTaskAction = async (taskId: string) => {
  return actionHandler(() =>
    apiClient.get<ApiResponse<TaskDetails>>(`/task/${taskId}`),
  );
};

export type MyPostedTasksParams = {
  page?: number;
  limit?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  status?: TaskStatusType;
  category?: TaskCategoryType;
  searchTerm?: string;
};

const getMyPostedTasksAction = async (params: MyPostedTasksParams) => {
  return actionHandler(() =>
    apiClient.get<TasksResponse>("/task/my-posted-tasks", { params }),
  );
};

export type UpdateTaskImagesPayload = {
  keepImageIds: string[];
  newImages: Array<{ url: string; altText?: string }>;
};

const getMyPostedTaskAction = async (taskId: string) => {
  return actionHandler(() =>
    apiClient.get<ApiResponse<MyPostedTask>>(`/task/my-posted-task/${taskId}`),
  );
};

const updateTaskImagesAction = async (
  taskId: string,
  payload: UpdateTaskImagesPayload,
) => {
  return actionHandler(() =>
    apiClient.patch<ApiResponse<TaskImage[]>>(`/task/${taskId}/image`, payload),
  );
};

const updateTaskAction = async (taskId: string, data: PostTaskPayload) => {
  const payload = {
    ...data,
    baseCompensation:
      typeof data.baseCompensation === "string"
        ? parseFloat(data.baseCompensation as string)
        : data.baseCompensation,
    estimatedDuration:
      typeof data.estimatedDuration === "string"
        ? parseInt(data.estimatedDuration as string, 10)
        : data.estimatedDuration,
    scheduledAt: toIsoDateTime(data.scheduledAt),
    expiresAt: data.expiresAt ? toIsoDateTime(data.expiresAt) : undefined,
  };
  return actionHandler(() =>
    apiClient.patch<ApiResponse<TaskDetails>>(
      `/task/update-task/${taskId}`,
      payload,
    ),
  );
};

export {
  postTaskAction,
  postTaskImagesAction,
  getTaskAction,
  getMyPostedTasksAction,
  getMyPostedTaskAction,
  updateTaskImagesAction,
  updateTaskAction,
};
