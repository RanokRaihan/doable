"use client";

import { Calendar, CheckCircle2, Loader2, MessageSquare, XCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationStatusType, TaskApplicationDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<ApplicationStatusType, { label: string; className: string }> = {
  PENDING:   { label: "Pending",   className: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED:  { label: "Approved",  className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED:  { label: "Rejected",  className: "bg-red-100   text-red-700   border-red-200"   },
  WITHDRAWN: { label: "Withdrawn", className: "bg-gray-100  text-gray-600  border-gray-200"  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface TaskApplicationCardProps {
  application: TaskApplicationDetail;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isActing: boolean;
}

export function TaskApplicationCard({
  application,
  onApprove,
  onReject,
  isActing,
}: TaskApplicationCardProps) {
  const status = statusConfig[application.status];
  const isPending = application.status === "PENDING";

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 p-5">
      {/* Top row: avatar + name + date + status + compensation */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
              {getInitials(application.applicant.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">
              {application.applicant.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
              <Calendar className="h-3 w-3 shrink-0" />
              Applied {formatDate(application.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-base font-bold text-slate-800">
            ${application.proposedCompensation}
          </span>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium hidden sm:inline-flex", status.className)}
          >
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Message */}
      <div className="mt-4 flex items-start gap-2">
        <MessageSquare className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {application.message}
        </p>
      </div>

      {/* Rejection / withdrawal reason */}
      {(application.rejectionReason || application.withdrawalReason) && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
          <span className="font-medium text-slate-700">
            {application.rejectionReason ? "Rejection reason: " : "Withdrawal reason: "}
          </span>
          {application.rejectionReason ?? application.withdrawalReason}
        </div>
      )}

      {/* Actions — only for PENDING */}
      {isPending && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(application.id)}
            disabled={isActing}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            {isActing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5">Reject</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onApprove(application.id)}
            disabled={isActing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isActing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5">Approve</span>
          </Button>
        </div>
      )}
    </div>
  );
}
