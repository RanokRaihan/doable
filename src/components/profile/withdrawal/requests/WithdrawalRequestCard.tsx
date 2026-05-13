import Link from "next/link";
import { Calendar, ChevronRight, FileText, Smartphone, Building2 } from "lucide-react";

import { WithdrawalStatusBadge } from "@/components/profile/withdrawal/WithdrawalStatusBadge";
import { Badge } from "@/components/ui/badge";
import { WithdrawalRequestWithMethod } from "@/lib/types";

interface WithdrawalRequestCardProps {
  request: WithdrawalRequestWithMethod;
}

function formatAmount(amount: string) {
  const num = parseFloat(amount);
  return `৳ ${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function WithdrawalRequestCard({ request }: WithdrawalRequestCardProps) {
  const method = request.withdrawalMethod;
  const isBank = method.methodType === "BANK";
  const maskedAccount =
    method.accountNumber.length > 4
      ? `••••${method.accountNumber.slice(-4)}`
      : method.accountNumber;

  const createdAt = new Date(request.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const notePreview = request.note
    ? request.note.length > 80
      ? `${request.note.slice(0, 80)}…`
      : request.note
    : null;

  return (
    <Link href={`/profile/withdrawal/requests/${request.id}`}>
      <div className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-2xl font-bold text-slate-900">
              {formatAmount(request.amount)}
            </p>
            <WithdrawalStatusBadge status={request.status} />
          </div>

          <div className="flex items-center gap-2 mb-2">
            {isBank ? (
              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            ) : (
              <Smartphone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            )}
            <Badge variant="outline" className="text-xs py-0 shrink-0">
              {isBank ? "BANK" : "MOBILE"}
            </Badge>
            <span className="text-sm text-slate-500 font-mono truncate">
              {maskedAccount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{createdAt}</span>
          </div>

          {notePreview && (
            <div className="flex items-start gap-1.5 mt-2">
              <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-500 line-clamp-2">{notePreview}</p>
            </div>
          )}
        </div>

        <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
