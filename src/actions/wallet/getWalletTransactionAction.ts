"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { WalletTransactionDetailResponse } from "@/lib/types";

const getWalletTransactionAction = async (id: string) =>
  actionHandler(() =>
    apiClient.get<WalletTransactionDetailResponse>(
      `/wallet/wallet-transaction/${id}`,
    ),
  );

export default getWalletTransactionAction;
