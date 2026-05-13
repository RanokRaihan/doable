"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalRequestResponse } from "@/lib/types";
import { CreateWithdrawalRequestFormData } from "@/schema/createWithdrawalRequestValidation";

const createWithdrawalRequestAction = async (
  data: CreateWithdrawalRequestFormData,
) =>
  actionHandler(() =>
    apiClient.post<WithdrawalRequestResponse>("/withdrawal/my-requests", data),
  );

export default createWithdrawalRequestAction;
