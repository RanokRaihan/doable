"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import {
  ApplicationSortField,
  ApplicationStatusType,
  ApplicationsResponse,
  SortOrder,
  TaskApplicationsResponse,
} from "@/lib/types";
import { ApplyTaskFormData } from "@/schema/applyTaskValidation";

const applyTaskAction = async (taskId: string, data: ApplyTaskFormData) =>
  actionHandler(() =>
    apiClient.post<ApiResponse<unknown>>(`/application/${taskId}`, data),
  );

export type MyApplicationsParams = {
  page?: number;
  limit?: number;
  sortBy?: ApplicationSortField;
  sortOrder?: SortOrder;
  status?: ApplicationStatusType;
};

const getMyApplicationsAction = async (params: MyApplicationsParams = {}) =>
  actionHandler(() =>
    apiClient.get<ApplicationsResponse>("/application/my-applications", { params }),
  );

export type TaskApplicationsParams = {
  page?: number;
  limit?: number;
  sortBy?: ApplicationSortField;
  sortOrder?: SortOrder;
  status?: ApplicationStatusType;
  searchTerm?: string;
};

const getTaskApplicationsAction = async (
  taskId: string,
  params: TaskApplicationsParams = {},
) =>
  actionHandler(() =>
    apiClient.get<TaskApplicationsResponse>(`/application/task/${taskId}`, { params }),
  );

export { applyTaskAction, getMyApplicationsAction, getTaskApplicationsAction };
