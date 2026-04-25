"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";

const approveCompletionAction = async (taskId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<void>>(`/task/${taskId}/approve-completion`),
  );

export default approveCompletionAction;
