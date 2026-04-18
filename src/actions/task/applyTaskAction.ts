"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import { MyApplication } from "@/lib/types";
import { ApplyTaskFormData } from "@/schema/applyTaskValidation";

const applyTaskAction = async (taskId: string, data: ApplyTaskFormData) =>
  actionHandler(() =>
    apiClient.post<ApiResponse<unknown>>(`/application/${taskId}`, data),
  );

const getMyApplicationsAction = async () =>
  actionHandler(() =>
    apiClient.get<ApiResponse<MyApplication[]>>("/application/my-applications"),
  );

export { applyTaskAction, getMyApplicationsAction };
