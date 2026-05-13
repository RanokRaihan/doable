import Link from "next/link";
import { Building2, ChevronRight, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { WithdrawalMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WithdrawalMethodCardProps {
  method: WithdrawalMethod;
}

export function WithdrawalMethodCard({ method }: WithdrawalMethodCardProps) {
  const isBank = method.methodType === "BANK";

  const maskedAccountNumber =
    method.accountNumber.length > 4
      ? `••••${method.accountNumber.slice(-4)}`
      : method.accountNumber;

  return (
    <Link href={`/profile/withdrawal/methods/${method.id}`}>
      <div
        className={cn(
          "group relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-sm",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isBank ? "bg-blue-100" : "bg-violet-100",
          )}
        >
          {isBank ? (
            <Building2 className="h-5 w-5 text-blue-600" />
          ) : (
            <Smartphone className="h-5 w-5 text-violet-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-medium shrink-0",
                isBank
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-violet-200 bg-violet-50 text-violet-700",
              )}
            >
              {isBank ? "Bank Transfer" : "Mobile Banking"}
            </Badge>
            {method.isDefault && (
              <Badge
                variant="outline"
                className="text-xs border-green-300 bg-green-50 text-green-700 shrink-0"
              >
                Default
              </Badge>
            )}
          </div>

          <p className="font-semibold text-slate-900 truncate">
            {method.accountName}
          </p>
          <p className="text-sm text-slate-500 font-mono mt-0.5">
            {maskedAccountNumber}
          </p>

          {isBank && method.bankName && (
            <p className="text-sm text-slate-500 mt-1">
              {method.bankName}
              {method.branchName && ` — ${method.branchName}`}
            </p>
          )}
        </div>

        <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
