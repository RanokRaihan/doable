"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/lib/api/types";

const withdrawApplicationAction = async (applicationId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<void>>(`/application/withdraw/${applicationId}`)
  );

export default withdrawApplicationAction;
