"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import type {
  PaymentMethodType,
  PaymentSortField,
  PaymentsReceivedListResponse,
  SortOrder,
} from "@/lib/types";

export type PaymentsReceivedParams = {
  page?: number;
  limit?: number;
  sortBy?: PaymentSortField;
  sortOrder?: SortOrder;
  method?: PaymentMethodType;
};

const getPaymentsReceivedAction = async (params: PaymentsReceivedParams = {}) =>
  actionHandler(() =>
    apiClient.get<PaymentsReceivedListResponse>("/payment/user/payment-received", { params }),
  );

export default getPaymentsReceivedAction;
