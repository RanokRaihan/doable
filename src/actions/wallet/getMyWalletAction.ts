"use server";

import { apiClient } from "@/lib/api/client";
import { actionHandler } from "@/lib/api/actionHandler";
import { MyWalletResponse } from "@/lib/types";

const getMyWalletAction = async () =>
  actionHandler(() => apiClient.get<MyWalletResponse>("/wallet/my-wallet"));

export default getMyWalletAction;
