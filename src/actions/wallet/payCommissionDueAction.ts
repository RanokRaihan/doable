"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { CommissionDue } from "@/lib/types";

const payCommissionDueAction = async (dueId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<CommissionDue>>(
      `/wallet/commission-due/pay/${dueId}`,
    ),
  );

export default payCommissionDueAction;
