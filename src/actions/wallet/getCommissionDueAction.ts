"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { CommissionDueDetail } from "@/lib/types";

const getCommissionDueAction = async (dueId: string) =>
  actionHandler(() =>
    apiClient.get<ApiResponse<CommissionDueDetail>>(
      `/wallet/commission-due/${dueId}`,
    ),
  );

export default getCommissionDueAction;
