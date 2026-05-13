"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { WithdrawalRequestResponse } from "@/lib/types";
import { EditWithdrawalRequestFormData } from "@/schema/editWithdrawalRequestValidation";

const editWithdrawalRequestAction = async (
  id: string,
  data: EditWithdrawalRequestFormData,
) =>
  actionHandler(() =>
    apiClient.patch<WithdrawalRequestResponse>(
      `/withdrawal/my-requests/${id}`,
      data,
    ),
  );

export default editWithdrawalRequestAction;
