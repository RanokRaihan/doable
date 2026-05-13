"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalRequestResponse } from "@/lib/types";

const getWithdrawalRequestAction = async (id: string) =>
  actionHandler(() =>
    apiClient.get<WithdrawalRequestResponse>(`/withdrawal/my-requests/${id}`),
  );

export default getWithdrawalRequestAction;
