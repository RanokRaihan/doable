"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { TaskPaymentRecord } from "@/lib/types";

const declineCashPaymentAction = async (paymentId: string) =>
  actionHandler(() =>
    apiClient.patch<ApiResponse<TaskPaymentRecord>>(
      `/payment/cash/decline/${paymentId}`,
    ),
  );

export default declineCashPaymentAction;
