"use client";

import Link from "next/link";
import {
  Building2,
  Calendar,
  Edit,
  ExternalLink,
  FileText,
  Hash,
  MapPin,
  MessageSquare,
  Smartphone,
  User,
  XCircle,
} from "lucide-react";

import { CancelWithdrawalRequestDialog } from "@/components/profile/withdrawal/requests/CancelWithdrawalRequestDialog";
import { WithdrawalStatusBadge } from "@/components/profile/withdrawal/WithdrawalStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WithdrawalRequestWithMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WithdrawalRequestDetailProps {
  request: WithdrawalRequestWithMethod;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="text-sm font-medium text-slate-800 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function formatAmount(amount: string) {
  const num = parseFloat(amount);
  return `৳ ${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WithdrawalRequestDetail({
  request,
}: WithdrawalRequestDetailProps) {
  const method = request.withdrawalMethod;
  const isBank = method.methodType === "BANK";
  const isPending = request.status === "PENDING";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-3xl font-bold text-slate-900">
              {formatAmount(request.amount)}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {formatDate(request.createdAt)}
            </p>
          </div>
          <WithdrawalStatusBadge status={request.status} className="text-sm" />
        </div>
      </div>

      {/* Method info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Withdrawal Method
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                isBank ? "bg-blue-100" : "bg-violet-100",
              )}
            >
              {isBank ? (
                <Building2 className="h-4 w-4 text-blue-600" />
              ) : (
                <Smartphone className="h-4 w-4 text-violet-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Type
              </p>
              <Badge
                variant="outline"
                className={cn(
                  "mt-0.5",
                  isBank
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-violet-200 bg-violet-50 text-violet-700",
                )}
              >
                {isBank ? "Bank Transfer" : "Mobile Banking"}
              </Badge>
            </div>
          </div>
          <InfoRow
            icon={User}
            label="Account Name"
            value={method.accountName}
          />
          <InfoRow
            icon={Hash}
            label="Account Number"
            value={
              <span className="font-mono">{method.accountNumber}</span>
            }
          />
          {isBank && method.bankName && (
            <InfoRow
              icon={Building2}
              label="Bank"
              value={method.bankName}
            />
          )}
          {isBank && method.branchName && (
            <InfoRow
              icon={MapPin}
              label="Branch"
              value={method.branchName}
            />
          )}
        </div>
      </div>

      {/* Request details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Request Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {request.note && (
            <InfoRow
              icon={FileText}
              label="Note"
              value={request.note}
              className="sm:col-span-2"
            />
          )}
          {request.refWalletTnxId && (
            <InfoRow
              icon={ExternalLink}
              label="Wallet Transaction"
              value={
                <Link
                  href={`/profile/wallet/${request.refWalletTnxId}`}
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  View transaction
                  <ExternalLink className="h-3 w-3" />
                </Link>
              }
            />
          )}
          {request.processedAt && (
            <InfoRow
              icon={Calendar}
              label="Processed At"
              value={formatDate(request.processedAt)}
            />
          )}
          {request.cancelledAt && (
            <InfoRow
              icon={Calendar}
              label="Cancelled At"
              value={formatDate(request.cancelledAt)}
            />
          )}
          {request.rejectedAt && (
            <InfoRow
              icon={Calendar}
              label="Rejected At"
              value={formatDate(request.rejectedAt)}
            />
          )}
        </div>
      </div>

      {/* Rejection info */}
      {request.status === "REJECTED" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 space-y-2">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejection Details
          </h3>
          {request.rejectionReason && (
            <p className="text-sm text-red-700">{request.rejectionReason}</p>
          )}
          {request.rejectedBy && (
            <p className="text-xs text-red-500">Rejected by: {request.rejectedBy}</p>
          )}
        </div>
      )}

      {/* Cancellation info */}
      {request.status === "CANCELLED" && request.cancellationReason && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Cancellation Reason
          </h3>
          <p className="text-sm text-slate-600">{request.cancellationReason}</p>
        </div>
      )}

      {/* Action bar — only for PENDING */}
      {isPending && (
        <>
          <Separator />
          <div className="flex items-center gap-3 flex-wrap">
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/profile/withdrawal/requests/${request.id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit Request
              </Link>
            </Button>
            <CancelWithdrawalRequestDialog
              requestId={request.id}
              amount={request.amount}
            >
              <Button variant="destructive" className="gap-2">
                <XCircle className="h-4 w-4" />
                Cancel Request
              </Button>
            </CancelWithdrawalRequestDialog>
          </div>
        </>
      )}
    </div>
  );
}
