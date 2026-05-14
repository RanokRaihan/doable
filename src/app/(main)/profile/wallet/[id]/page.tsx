import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldOff, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Transaction Detail",
  description: "View the details of a wallet transaction.",
};

import getWalletTransactionAction from "@/actions/wallet/getWalletTransactionAction";
import { WalletTransactionDetail } from "@/components/profile/wallet/WalletTransactionDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WalletTransactionDetailResponse, WalletTransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

function statusStyles(status: string) {
  switch (status) {
    case "COMPLETED": return "border-green-300 bg-green-50 text-green-700";
    case "PENDING":   return "border-amber-300 bg-amber-50 text-amber-700";
    case "FAILED":    return "border-red-300 bg-red-50 text-red-700";
    default:          return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export default async function WalletTransactionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getWalletTransactionAction(id);

  if (!result.success) {
    const statusCode = "statusCode" in result ? result.statusCode : 500;
    const message = "message" in result ? result.message : "Something went wrong";

    if (statusCode === 400 || statusCode === 403 || statusCode === 404) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ShieldOff className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {statusCode === 404 ? "Transaction Not Found" : "Access Denied"}
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
          <Link href="/profile/wallet">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wallet
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
        <Link href="/profile/wallet">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallet
          </Button>
        </Link>
      </div>
    );
  }

  const transaction = (result as WalletTransactionDetailResponse).data;
  const isCredit = transaction.type === WalletTransactionType.CREDIT;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/profile/wallet"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallet
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isCredit ? "+" : "-"}৳ {transaction.amount}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {transaction.transactionId}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn(
                "text-sm font-medium px-3 py-1",
                isCredit
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700",
              )}
            >
              {transaction.type}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-sm font-medium px-3 py-1", statusStyles(transaction.status))}
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      </div>

      <WalletTransactionDetail transaction={transaction} />
    </div>
  );
}
