"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { PaymentDetail } from "@/lib/types";

const getPaymentDetailAction = async (paymentId: string) =>
  actionHandler(() =>
    apiClient.get<ApiResponse<PaymentDetail>>(`/payment/${paymentId}`),
  );

export default getPaymentDetailAction;
