"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";

const markTaskCompletedAction = async (taskId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<void>>(`/task/${taskId}/mark-completed`),
  );

export default markTaskCompletedAction;
