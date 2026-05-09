"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import {
  SortOrder,
  WithdrawalRequestSortField,
  WithdrawalRequestsListResponse,
  WithdrawalStatusType,
} from "@/lib/types";

export type GetWithdrawalRequestsParams = {
  page?: number;
  limit?: number;
  sortBy?: WithdrawalRequestSortField;
  sortOrder?: SortOrder;
  status?: WithdrawalStatusType;
};

const getWithdrawalRequestsAction = async (
  params: GetWithdrawalRequestsParams = {},
) =>
  actionHandler(() =>
    apiClient.get<WithdrawalRequestsListResponse>("/withdrawal/my-requests", {
      params,
    }),
  );

export default getWithdrawalRequestsAction;
