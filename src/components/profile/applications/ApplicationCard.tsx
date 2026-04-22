"use client";

import Link from "next/link";
import { Calendar, FileText, Loader2, MoreVertical, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import withdrawApplicationAction from "@/actions/application/withdrawApplicationAction";
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
  onWithdrawSuccess: () => void;
}

export function ApplicationCard({ application, onWithdrawSuccess }: ApplicationCardProps) {
  const status = statusConfig[application.status];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleConfirmWithdraw = async () => {
    setIsWithdrawing(true);
    setServerError(null);
    const result = await withdrawApplicationAction(application.id);
    setIsWithdrawing(false);

    if (!result.success) {
      const msg =
        "errorSources" in result && result.errorSources?.length
          ? result.errorSources[0].message
          : result.message;
      setServerError(msg);
      return;
    }

    setConfirmOpen(false);
    toast.success("Application withdrawn successfully.");
    onWithdrawSuccess();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200">
        {/* Icon */}
        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <FileText className="h-6 w-6 text-blue-500" />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/applications/${application.id}`}
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
            className={cn("text-xs font-medium", status.className)}
          >
            {status.label}
          </Badge>

          {application.status === "PENDING" && (
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
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setConfirmOpen(true)}
                >
                  Withdraw Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isWithdrawing) {
            setConfirmOpen(open);
            if (!open) setServerError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <TriangleAlert className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle>Withdraw Application</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to withdraw your application for{" "}
              <span className="font-medium text-slate-700">
                &ldquo;{application.task.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {serverError && (
            <ServerErrorDisplay
              serverError={serverError}
              setServerError={setServerError}
            />
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isWithdrawing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Withdrawing…
                </>
              ) : (
                "Withdraw"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
