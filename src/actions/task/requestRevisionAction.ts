"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";

const requestRevisionAction = async (taskId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<void>>(`/task/${taskId}/request-revision`),
  );

export default requestRevisionAction;
