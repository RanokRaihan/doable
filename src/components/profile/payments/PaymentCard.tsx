import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  PaymentMadeItem,
  PaymentMethodType,
  PaymentReceivedItem,
  PaymentStatusType,
} from "@/lib/types";

type Props =
  | { variant: "made"; payment: PaymentMadeItem }
  | { variant: "received"; payment: PaymentReceivedItem };

function paymentStatusStyles(status: PaymentStatusType): string {
  switch (status) {
    case "COMPLETED":  return "border-green-300 bg-green-50 text-green-700";
    case "FAILED":     return "border-red-300 bg-red-50 text-red-700";
    case "PENDING":    return "border-amber-300 bg-amber-50 text-amber-700";
    case "CANCELLED":  return "border-slate-200 bg-slate-50 text-slate-600";
    case "REFUNDED":   return "border-blue-300 bg-blue-50 text-blue-700";
    default:           return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function methodStyles(method: PaymentMethodType): string {
  return method === "ONLINE"
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : "border-orange-200 bg-orange-50 text-orange-700";
}

export function PaymentCard({ variant, payment }: Props) {
  const isMade = variant === "made";
  const counterparty = isMade
    ? (payment as PaymentMadeItem).payee
    : (payment as PaymentReceivedItem).payer;
  const counterpartyLabel = isMade ? "To" : "From";

  const formattedDate = new Date(payment.createdAt).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  return (
    <Link href={`/profile/payments/${payment.id}`} className="block group">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md hover:border-slate-200 transition-all">
        <div
          className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
            isMade ? "bg-red-50" : "bg-green-50",
          )}
        >
          {isMade ? (
            <ArrowUpRight className="h-6 w-6 text-red-500" />
          ) : (
            <ArrowDownLeft className="h-6 w-6 text-green-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span
              className={cn(
                "text-base font-bold",
                isMade ? "text-red-600" : "text-green-700",
              )}
            >
              {isMade ? "-" : "+"}৳ {payment.amount}
            </span>
            <Badge
              variant="outline"
              className={cn("text-xs", paymentStatusStyles(payment.status))}
            >
              {payment.status}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", methodStyles(payment.method))}
            >
              {payment.method}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {counterpartyLabel}: {counterparty.name}
            <span className="text-slate-400 ml-1">({counterparty.email})</span>
          </p>
          <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
            {payment.transactionId}
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
