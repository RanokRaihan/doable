import { Banknote, Calendar, Clock, Hash, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletTransactionDetail as WalletTransactionDetailType, WalletTransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WalletTransactionDetailProps {
  transaction: WalletTransactionDetailType;
}

function statusStyles(status: string) {
  switch (status) {
    case "COMPLETED": return "border-green-300 bg-green-50 text-green-700";
    case "PENDING":   return "border-amber-300 bg-amber-50 text-amber-700";
    case "FAILED":    return "border-red-300 bg-red-50 text-red-700";
    default:          return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function formatCategory(category: string) {
  return category
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");
}

export function WalletTransactionDetail({ transaction }: WalletTransactionDetailProps) {
  const isCredit = transaction.type === WalletTransactionType.CREDIT;

  const createdAt = new Date(transaction.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const walletUpdatedAt = new Date(transaction.wallet.updatedAt).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-indigo-500" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Amount</p>
                <p
                  className={cn(
                    "font-bold text-lg",
                    isCredit ? "text-green-700" : "text-red-700",
                  )}
                >
                  {isCredit ? "+" : "-"}৳ {transaction.amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Type</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    isCredit
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-red-300 bg-red-50 text-red-700",
                  )}
                >
                  {transaction.type}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Status</p>
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusStyles(transaction.status))}
                >
                  {transaction.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Category</p>
                <p className="text-slate-700">{formatCategory(transaction.category)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400 mb-0.5">Description</p>
                <p className="text-slate-700">{transaction.description}</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-2">Balance Change</p>
              <div className="flex items-center gap-3 text-sm font-mono">
                <span className="text-slate-600">৳ {transaction.balanceBefore}</span>
                <span className="text-slate-400">→</span>
                <span className="font-semibold text-slate-900">৳ {transaction.balanceAfter}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-50 pt-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {createdAt}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-500" />
              Reference IDs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono text-slate-500">
            <div>
              <p className="text-slate-400 mb-0.5">Transaction ID</p>
              <p className="break-all text-slate-700">{transaction.transactionId}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Wallet ID</p>
              <p className="break-all">{transaction.walletId}</p>
            </div>
            {transaction.refPaymentId && (
              <div>
                <p className="text-slate-400 mb-0.5">Payment Reference</p>
                <p className="break-all">{transaction.refPaymentId}</p>
              </div>
            )}
            {transaction.refCommissionDueId && (
              <div>
                <p className="text-slate-400 mb-0.5">Commission Due Reference</p>
                <p className="break-all">{transaction.refCommissionDueId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Banknote className="h-4 w-4 text-blue-500" />
              Wallet Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Current Balance</p>
              <p className="font-bold text-xl text-slate-900">৳ {transaction.wallet.balance}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Wallet ID</p>
              <p className="font-mono text-xs text-slate-500 break-all">{transaction.wallet.id}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 border-t border-slate-50 pt-3">
              <Clock className="h-3 w-3" />
              <span>Updated {walletUpdatedAt}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
