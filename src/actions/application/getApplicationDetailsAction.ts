"use server";

import { actionHandler } from "@/lib/api/actionHandler";
import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/lib/api/types";
import { ApplicationDetails } from "@/lib/types";

const getApplicationDetailsAction = async (applicationId: string) =>
  actionHandler(() =>
    apiClient.get<ApiResponse<ApplicationDetails>>(`/application/${applicationId}`)
  );

export default getApplicationDetailsAction;
