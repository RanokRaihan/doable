"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { CashPaymentInitData } from "@/lib/types";

const initCashPaymentAction = async (taskId: string) =>
  actionHandler(() =>
    apiClient.post<ApiResponse<CashPaymentInitData>>(
      `/payment/cash/init/${taskId}`,
    ),
  );

export default initCashPaymentAction;
