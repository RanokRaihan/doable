"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { CommissionDueSortField, CommissionsDueListResponse, SortOrder } from "@/lib/types";

export type CommissionsDueParams = {
  page?: number;
  limit?: number;
  sortBy?: CommissionDueSortField;
  sortOrder?: SortOrder;
};

const getCommissionsDueAction = async (params: CommissionsDueParams = {}) =>
  actionHandler(() =>
    apiClient.get<CommissionsDueListResponse>("/wallet/commission-due", { params }),
  );

export default getCommissionsDueAction;
