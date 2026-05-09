"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalMethodResponse } from "@/lib/types";

const getWithdrawalMethodAction = async (id: string) =>
  actionHandler(() =>
    apiClient.get<WithdrawalMethodResponse>(`/withdrawal/my-methods/${id}`),
  );

export default getWithdrawalMethodAction;
