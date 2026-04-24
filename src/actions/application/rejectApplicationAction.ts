"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/lib/api/types";

const rejectApplicationAction = async (
  applicationId: string,
  rejectionReason: string,
) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<void>>(`/application/reject/${applicationId}`, {
      rejectionReason,
    })
  );

export default rejectApplicationAction;
