"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalMethodResponse } from "@/lib/types";

const setDefaultWithdrawalMethodAction = async (id: string) =>
  actionHandler(() =>
    apiClient.patch<WithdrawalMethodResponse>(
      `/withdrawal/my-methods/${id}/set-default`,
    ),
  );

export default setDefaultWithdrawalMethodAction;
