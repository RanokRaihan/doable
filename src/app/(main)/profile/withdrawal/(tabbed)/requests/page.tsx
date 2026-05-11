import { AlertCircle } from "lucide-react";

import getMyWalletAction from "@/actions/wallet/getMyWalletAction";
import getWithdrawalMethodsAction from "@/actions/withdrawal/getWithdrawalMethodsAction";
import getWithdrawalRequestsAction from "@/actions/withdrawal/getWithdrawalRequestsAction";
import { WithdrawalRequestsClient } from "@/components/profile/withdrawal/requests/WithdrawalRequestsClient";
import { requireAuth } from "@/lib/auth/requireAuth";
import {
  MyWalletResponse,
  SortOrder,
  WithdrawalMethodsListResponse,
  WithdrawalRequestSortField,
  WithdrawalRequestsListResponse,
  WithdrawalStatusType,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const VALID_STATUSES: WithdrawalStatusType[] = [
  "PENDING",
  "APPROVED",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

export default async function WithdrawalRequestsPage({
  searchParams,
}: PageProps) {
  await requireAuth();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const sortBy = (params.sortBy as WithdrawalRequestSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const rawStatus =
    typeof params.status === "string" ? params.status : undefined;
  const status: WithdrawalStatusType | undefined =
    rawStatus && VALID_STATUSES.includes(rawStatus as WithdrawalStatusType)
      ? (rawStatus as WithdrawalStatusType)
      : undefined;

  const [requestsResult, methodsResult, walletResult] = await Promise.all([
    getWithdrawalRequestsAction({ page, limit, sortBy, sortOrder, status }),
    getWithdrawalMethodsAction(),
    getMyWalletAction(),
  ]);
  if (!requestsResult.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">
            Failed to load withdrawal requests
          </p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in requestsResult
              ? requestsResult.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const requestsTyped = requestsResult as WithdrawalRequestsListResponse;
  const requests = requestsTyped.data;
  const meta = requestsTyped.meta;

  const methods = methodsResult.success
    ? (methodsResult as WithdrawalMethodsListResponse).data
    : [];

  const walletBalance = walletResult.success
    ? (walletResult as MyWalletResponse).data.balance
    : "0";

  const currentFilters = { page, limit, sortBy, sortOrder, status };

  return (
    <>
      {!walletResult.success && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 mb-4 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Could not load wallet balance.</span>
        </div>
      )}
      <WithdrawalRequestsClient
        requests={requests}
        meta={meta}
        currentFilters={currentFilters}
        walletBalance={walletBalance}
        methods={methods}
      />
    </>
  );
}
