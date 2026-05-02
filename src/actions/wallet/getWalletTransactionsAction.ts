"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import {
  SortOrder,
  WalletTransactionsListResponse,
  WalletTransactionSortField,
  WalletTransactionTypeType,
} from "@/lib/types";

export type WalletTransactionsParams = {
  page?: number;
  limit?: number;
  type?: WalletTransactionTypeType;
  sortBy?: WalletTransactionSortField;
  sortOrder?: SortOrder;
};

const getWalletTransactionsAction = async (params: WalletTransactionsParams = {}) =>
  actionHandler(() =>
    apiClient.get<WalletTransactionsListResponse>("/wallet/wallet-transactions", { params }),
  );

export default getWalletTransactionsAction;
