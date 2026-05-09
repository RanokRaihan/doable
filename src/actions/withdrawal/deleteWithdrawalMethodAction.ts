"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalMethodResponse } from "@/lib/types";

const deleteWithdrawalMethodAction = async (id: string) =>
  actionHandler(() =>
    apiClient.delete<WithdrawalMethodResponse>(`/withdrawal/my-methods/${id}`),
  );

export default deleteWithdrawalMethodAction;
