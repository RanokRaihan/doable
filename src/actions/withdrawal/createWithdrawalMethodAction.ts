"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalMethodResponse } from "@/lib/types";
import { CreateWithdrawalMethodFormData } from "@/schema/createWithdrawalMethodValidation";

const createWithdrawalMethodAction = async (
  data: CreateWithdrawalMethodFormData,
) =>
  actionHandler(() =>
    apiClient.post<WithdrawalMethodResponse>("/withdrawal/my-methods", data),
  );

export default createWithdrawalMethodAction;
