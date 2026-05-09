"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalMethodResponse } from "@/lib/types";
import { UpdateWithdrawalMethodFormData } from "@/schema/updateWithdrawalMethodValidation";

const updateWithdrawalMethodAction = async (
  id: string,
  data: UpdateWithdrawalMethodFormData,
) =>
  actionHandler(() =>
    apiClient.patch<WithdrawalMethodResponse>(
      `/withdrawal/my-methods/${id}`,
      data,
    ),
  );

export default updateWithdrawalMethodAction;
