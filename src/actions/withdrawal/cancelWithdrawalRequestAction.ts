"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api/client";
import { WithdrawalRequestResponse } from "@/lib/types";

const cancelWithdrawalRequestAction = async (
  id: string,
  data: { cancellationReason?: string } = {},
) =>
  actionHandler(() =>
    apiClient.patch<WithdrawalRequestResponse>(
      `/withdrawal/my-requests/${id}/cancel`,
      data,
    ),
  );

export default cancelWithdrawalRequestAction;
