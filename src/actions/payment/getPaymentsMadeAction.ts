"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import type {
  PaymentMethodType,
  PaymentSortField,
  PaymentsMadeListResponse,
  PaymentStatusType,
  SortOrder,
} from "@/lib/types";

export type PaymentsMadeParams = {
  page?: number;
  limit?: number;
  sortBy?: PaymentSortField;
  sortOrder?: SortOrder;
  method?: PaymentMethodType;
  status?: PaymentStatusType;
};

const getPaymentsMadeAction = async (params: PaymentsMadeParams = {}) =>
  actionHandler(() =>
    apiClient.get<PaymentsMadeListResponse>("/payment/user/payment-made", { params }),
  );

export default getPaymentsMadeAction;
