import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { WalletTransaction, WalletTransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WalletTransactionCardProps {
  transaction: WalletTransaction;
}

function statusStyles(status: string) {
  switch (status) {
    case "COMPLETED": return "border-green-300 bg-green-50 text-green-700";
    case "PENDING":   return "border-amber-300 bg-amber-50 text-amber-700";
    case "FAILED":    return "border-red-300 bg-red-50 text-red-700";
    default:          return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function WalletTransactionCard({ transaction }: WalletTransactionCardProps) {
  const isCredit = transaction.type === WalletTransactionType.CREDIT;
  const formattedDate = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  return (
    <Link href={`/profile/wallet/${transaction.id}`} className="block group">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md hover:border-slate-200 transition-all">
        <div
          className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
            isCredit ? "bg-green-50" : "bg-red-50",
          )}
        >
          {isCredit ? (
            <ArrowUpRight className="h-6 w-6 text-green-600" />
          ) : (
            <ArrowDownLeft className="h-6 w-6 text-red-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span
              className={cn(
                "text-base font-bold",
                isCredit ? "text-green-700" : "text-red-700",
              )}
            >
              {isCredit ? "+" : "-"}৳ {transaction.amount}
            </span>
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
            <Badge
              variant="outline"
              className={cn("text-xs", statusStyles(transaction.status))}
            >
              {transaction.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 truncate">{transaction.description}</p>
          <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
            {transaction.transactionId}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{formattedDate}</p>
        </div>

        <div className="shrink-0 text-slate-300 group-hover:text-slate-500 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
