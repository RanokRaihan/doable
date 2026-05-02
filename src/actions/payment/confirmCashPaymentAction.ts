"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { TaskPaymentRecord } from "@/lib/types";

const confirmCashPaymentAction = async (paymentId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<TaskPaymentRecord>>(
      `/payment/cash/confirm/${paymentId}`,
    ),
  );

export default confirmCashPaymentAction;
