"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/lib/api/types";

const approveApplicationAction = async (applicationId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<void>>(`/application/approve/${applicationId}`)
  );

export default approveApplicationAction;
