"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

import confirmCashPaymentAction from "@/actions/payment/confirmCashPaymentAction";
import declineCashPaymentAction from "@/actions/payment/declineCashPaymentAction";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { BackendError } from "@/lib/api/types";
import { CashStatusType, TaskPaymentRecord } from "@/lib/types";

const cashStatusConfig: Record<
  CashStatusType,
  { label: string; className: string }
> = {
  PAYER_CLAIMED: {
    label: "Awaiting your confirmation",
    className: "text-amber-700 bg-amber-50 border-amber-200",
  },
  PAYEE_CONFIRMED: {
    label: "You confirmed receipt",
    className: "text-green-700 bg-green-50 border-green-200",
  },
  PAYEE_DISPUTED: {
    label: "You declined this payment",
    className: "text-red-700 bg-red-50 border-red-200",
  },
  ADMIN_VERIFIED: {
    label: "Verified by admin",
    className: "text-blue-700 bg-blue-50 border-blue-200",
  },
};

interface CashPaymentActionsProps {
  payment: TaskPaymentRecord;
}

export function CashPaymentActions({ payment }: CashPaymentActionsProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [declineError, setDeclineError] = useState<string | null>(null);

  const canAct = payment.cashStatus === "PAYER_CLAIMED";
  const cashStatus = payment.cashStatus
    ? cashStatusConfig[payment.cashStatus]
    : null;

  const formattedAmount = parseFloat(payment.amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleConfirm = async () => {
    setIsConfirming(true);
    setConfirmError(null);
    const result = await confirmCashPaymentAction(payment.id);
    setIsConfirming(false);

    if (!result.success) {
      const error = result as BackendError;
      setConfirmError(
        error.errorSources?.[0]?.message ?? error.message ?? "Failed to confirm payment.",
      );
      return;
    }

    setConfirmOpen(false);
    toast.success("Payment confirmed. The task is now marked as completed.");
    router.refresh();
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    setDeclineError(null);
    const result = await declineCashPaymentAction(payment.id);
    setIsDeclining(false);

    if (!result.success) {
      const error = result as BackendError;
      setDeclineError(
        error.errorSources?.[0]?.message ?? error.message ?? "Failed to decline payment.",
      );
      return;
    }

    setDeclineOpen(false);
    toast.success("Payment declined. The task has been marked as disputed.");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Payment summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Amount</span>
          <span className="font-bold text-slate-900">৳ {formattedAmount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Transaction ID</span>
          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {payment.transactionId.slice(0, 16)}…
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Claimed on</span>
          <span className="text-slate-700">
            {new Date(payment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Status badge */}
      {cashStatus && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${cashStatus.className}`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          {cashStatus.label}
        </div>
      )}

      {/* Actions — only when PAYER_CLAIMED */}
      {canAct && (
        <>
          <Separator />
          <p className="text-xs text-slate-500 leading-relaxed">
            The task poster has claimed they paid you{" "}
            <strong className="text-slate-700">৳ {formattedAmount}</strong> in
            cash. Please confirm or decline.
          </p>
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setConfirmOpen(true)}
              disabled={isDeclining}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Confirm
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeclineOpen(true)}
              disabled={isConfirming}
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Decline
            </Button>
          </div>
        </>
      )}

      {/* Confirm dialog */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isConfirming) {
            setConfirmOpen(open);
            if (!open) setConfirmError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
              <DialogTitle>Confirm Cash Receipt</DialogTitle>
            </div>
            <DialogDescription>
              Confirming means you have physically received{" "}
              <strong>৳ {formattedAmount}</strong> in cash from the task poster.
              This will mark the task as completed and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {confirmError && (
            <ServerErrorDisplay
              serverError={confirmError}
              setServerError={setConfirmError}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              {isConfirming ? "Confirming…" : "Yes, I Received It"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline dialog */}
      <Dialog
        open={declineOpen}
        onOpenChange={(open) => {
          if (!isDeclining) {
            setDeclineOpen(open);
            if (!open) setDeclineError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle>Decline Payment</DialogTitle>
            </div>
            <DialogDescription>
              Declining means you have{" "}
              <strong>not received ৳ {formattedAmount}</strong> in cash. This
              will mark the task as disputed and flag it for admin review.
            </DialogDescription>
          </DialogHeader>

          {declineError && (
            <ServerErrorDisplay
              serverError={declineError}
              setServerError={setDeclineError}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeclineOpen(false)}
              disabled={isDeclining}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isDeclining}
              variant="destructive"
            >
              {isDeclining ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {isDeclining ? "Processing…" : "Decline Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
