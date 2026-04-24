"use client";

import { Calendar, MessageSquare, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ApproveApplicationDialog } from "@/components/profile/tasks/ApproveApplicationDialog";
import { RejectApplicationDialog } from "@/components/profile/tasks/RejectApplicationDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  taskId: string;
  onActionSuccess: () => void;
}

export function TaskApplicationCard({
  application,
  taskId,
  onActionSuccess,
}: TaskApplicationCardProps) {
  const status = statusConfig[application.status];
  const isPending = application.status === "PENDING";
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 p-5">
        {/* Top row: avatar + name + date + status + compensation + menu */}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
                  aria-label="Application options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/profile/tasks/${taskId}/applications/${application.id}`}>
                    View
                  </Link>
                </DropdownMenuItem>
                {isPending && <DropdownMenuSeparator />}
                {isPending && (
                  <DropdownMenuItem onSelect={() => setApproveOpen(true)}>
                    Approve
                  </DropdownMenuItem>
                )}
                {isPending && (
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setRejectOpen(true)}
                  >
                    Reject
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
      </div>

      <ApproveApplicationDialog
        applicationId={application.id}
        applicantName={application.applicant.name}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={onActionSuccess}
      />
      <RejectApplicationDialog
        applicationId={application.id}
        applicantName={application.applicant.name}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={onActionSuccess}
      />
    </>
  );
}
