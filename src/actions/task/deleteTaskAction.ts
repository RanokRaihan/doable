"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";

const deleteTaskAction = async (taskId: string) => {
  return actionHandler(() =>
    apiClient.delete<ApiResponse<null>>(`/task/delete-task/${taskId}`),
  );
};

export default deleteTaskAction;
