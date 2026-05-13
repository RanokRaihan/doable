"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import {
  SortOrder,
  WithdrawalMethodSortField,
  WithdrawalMethodsListResponse,
  WithdrawalMethodTypeType,
} from "@/lib/types";

export type GetWithdrawalMethodsParams = {
  page?: number;
  limit?: number;
  sortBy?: WithdrawalMethodSortField;
  sortOrder?: SortOrder;
  methodType?: WithdrawalMethodTypeType;
};

const getWithdrawalMethodsAction = async (
  params: GetWithdrawalMethodsParams = {},
) =>
  actionHandler(() =>
    apiClient.get<WithdrawalMethodsListResponse>("/withdrawal/my-methods", {
      params,
    }),
  );

export default getWithdrawalMethodsAction;
