"use server";

import { apiClient } from "@/lib/api";
import { actionHandler } from "@/lib/api/actionHandler";
import { ApiResponse } from "@/lib/api/types";
import { PaymentSessionDetail } from "@/lib/types";

const getPaymentSessionAction = async (sessionToken: string) =>
  actionHandler(() =>
    apiClient.get<ApiResponse<PaymentSessionDetail>>(
      `/payment/session/${sessionToken}`,
    ),
  );

export default getPaymentSessionAction;
