"use client";

import Link from "next/link";
import { Calendar, FileText, Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationStatusType, MyApplication } from "@/lib/types";
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

interface ApplicationCardProps {
  application: MyApplication;
  onWithdraw: (id: string) => void;
  isWithdrawing: boolean;
}

export function ApplicationCard({ application, onWithdraw, isWithdrawing }: ApplicationCardProps) {
  const status = statusConfig[application.status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200">
      {/* Icon */}
      <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <FileText className="h-6 w-6 text-blue-500" />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/tasks/${application.task.id}`}
          className="font-semibold text-sm text-slate-900 truncate leading-tight hover:text-blue-600 transition-colors block"
        >
          {application.task.title}
        </Link>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {application.task.description}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
          <Calendar className="h-3 w-3 shrink-0" />
          Applied {formatDate(application.createdAt)}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-bold text-slate-800">
          ${application.proposedCompensation}
        </span>

        <Badge
          variant="outline"
          className={cn("text-xs font-medium hidden sm:inline-flex", status.className)}
        >
          {status.label}
        </Badge>

        {application.status === "PENDING" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWithdraw(application.id)}
            disabled={isWithdrawing}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs h-8 px-2"
          >
            {isWithdrawing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            <span className="ml-1 hidden sm:inline">Withdraw</span>
          </Button>
        )}
      </div>
    </div>
  );
}
