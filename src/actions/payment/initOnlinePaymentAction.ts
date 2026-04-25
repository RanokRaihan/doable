"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { OnlinePaymentInitData } from "@/lib/types";

const initOnlinePaymentAction = async (taskId: string) =>
  actionHandler(() =>
    apiClient.post<ApiResponse<OnlinePaymentInitData>>(
      `/payment/online/init/${taskId}`,
    ),
  );

export default initOnlinePaymentAction;
