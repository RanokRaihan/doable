import { AlertCircle } from "lucide-react";

import getWithdrawalMethodsAction from "@/actions/withdrawal/getWithdrawalMethodsAction";
import { WithdrawalMethodsClient } from "@/components/profile/withdrawal/methods/WithdrawalMethodsClient";
import { requireAuth } from "@/lib/auth/requireAuth";
import {
  SortOrder,
  WithdrawalMethodSortField,
  WithdrawalMethodTypeType,
  WithdrawalMethodsListResponse,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WithdrawalMethodsPage({
  searchParams,
}: PageProps) {
  await requireAuth();
  const params = await searchParams;

  const sortBy = (params.sortBy as WithdrawalMethodSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const rawMethodType =
    typeof params.methodType === "string" ? params.methodType : undefined;
  const methodType: WithdrawalMethodTypeType | undefined =
    rawMethodType === "BANK" || rawMethodType === "MOBILE_BANKING"
      ? rawMethodType
      : undefined;

  const result = await getWithdrawalMethodsAction({
    sortBy,
    sortOrder,
    methodType,
  });

  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">
            Failed to load withdrawal methods
          </p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in result
              ? result.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const methods = (result as WithdrawalMethodsListResponse).data;
  const currentFilters = { sortBy, sortOrder, methodType };

  return (
    <WithdrawalMethodsClient
      methods={methods}
      currentFilters={currentFilters}
    />
  );
}
