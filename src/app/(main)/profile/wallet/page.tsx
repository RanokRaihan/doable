import { AlertCircle } from "lucide-react";

import getMyWalletAction from "@/actions/wallet/getMyWalletAction";
import getWalletTransactionsAction from "@/actions/wallet/getWalletTransactionsAction";
import { WalletSummaryCard } from "@/components/profile/wallet/WalletSummaryCard";
import { WalletTransactionsClient } from "@/components/profile/wallet/WalletTransactionsClient";
import {
  MyWalletResponse,
  SortOrder,
  WalletTransactionSortField,
  WalletTransactionTypeType,
  WalletTransactionsListResponse,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WalletPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const sortBy = (params.sortBy as WalletTransactionSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const rawType = typeof params.type === "string" ? params.type : undefined;
  const type: WalletTransactionTypeType | undefined =
    rawType === "CREDIT" || rawType === "DEBIT" ? rawType : undefined;

  const [walletResult, transactionsResult] = await Promise.all([
    getMyWalletAction(),
    getWalletTransactionsAction({ page, limit, sortBy, sortOrder, type }),
  ]);

  if (!walletResult.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load wallet</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in walletResult ? walletResult.message : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  if (!transactionsResult.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load transactions</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in transactionsResult
              ? transactionsResult.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const wallet = (walletResult as MyWalletResponse).data;
  const { data: transactions, meta } = (
    transactionsResult as WalletTransactionsListResponse
  ).data;
  const currentFilters = { page, limit, sortBy, sortOrder, type };

  return (
    <div className="space-y-6">
      <WalletSummaryCard wallet={wallet} />
      <WalletTransactionsClient
        transactions={transactions}
        meta={meta}
        currentFilters={currentFilters}
      />
    </div>
  );
}
