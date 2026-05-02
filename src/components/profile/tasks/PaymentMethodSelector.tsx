"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Banknote,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  XCircle,
} from "lucide-react";

import initCashPaymentAction from "@/actions/payment/initCashPaymentAction";
import initOnlinePaymentAction from "@/actions/payment/initOnlinePaymentAction";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const cashStatusLabels: Record<CashStatusType, string> = {
  PAYER_CLAIMED: "Waiting for worker to confirm receipt",
  PAYEE_CONFIRMED: "Worker confirmed — payment complete",
  PAYEE_DISPUTED: "Worker has disputed this payment",
  ADMIN_VERIFIED: "Verified by admin",
};

interface PaymentMethodSelectorProps {
  taskId: string;
  agreedCompensation: string;
  existingPayments: TaskPaymentRecord[];
}

export function PaymentMethodSelector({
  taskId,
  agreedCompensation,
  existingPayments,
}: PaymentMethodSelectorProps) {
  const router = useRouter();
  const [cashDialogOpen, setCashDialogOpen] = useState(false);
  const [isCashPending, setIsCashPending] = useState(false);
  const [isOnlinePending, setIsOnlinePending] = useState(false);
  const [cashError, setCashError] = useState<string | null>(null);
  const [onlineError, setOnlineError] = useState<string | null>(null);

  const activePendingPayment = existingPayments.find(
    (p) => p.status === "PENDING",
  );
  const hasPendingCash = activePendingPayment?.method === "CASH";
  const hasPendingOnline = activePendingPayment?.method === "ONLINE";
  const hasFailedAttempt =
    !activePendingPayment &&
    existingPayments.some(
      (p) => p.status === "FAILED" || p.status === "CANCELLED",
    );

  const handleCashPayment = async () => {
    setIsCashPending(true);
    setCashError(null);
    const result = await initCashPaymentAction(taskId);
    setIsCashPending(false);

    if (!result.success) {
      const error = result as BackendError;
      setCashError(
        error.errorSources?.[0]?.message ?? error.message ?? "Payment failed.",
      );
      return;
    }

    setCashDialogOpen(false);
    toast.success(
      `Cash payment initiated — Transaction ID: ${result.data.transactionId}`,
    );
    router.refresh();
  };

  const handleOnlinePayment = async () => {
    setIsOnlinePending(true);
    setOnlineError(null);
    const result = await initOnlinePaymentAction(taskId);

    if (!result.success) {
      setIsOnlinePending(false);
      const error = result as BackendError;
      setOnlineError(
        error.errorSources?.[0]?.message ?? error.message ?? "Payment failed.",
      );
      return;
    }

    window.location.href = result.data.gatewayUrl;
  };

  const formattedAmount = parseFloat(agreedCompensation).toLocaleString(
    "en-BD",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

  return (
    <div className="space-y-4">
      {/* Amount */}
      <div className="rounded-xl border bg-emerald-50 border-emerald-200 px-5 py-4 flex items-center justify-between">
        <span className="text-sm font-medium text-emerald-700">
          Payment Amount
        </span>
        <span className="text-xl font-bold text-emerald-800">
          ৳ {formattedAmount}
        </span>
      </div>

      {/* Active payment status banner */}
      {activePendingPayment && (
        <div
          className={`rounded-xl border px-4 py-3 space-y-2 ${
            hasPendingCash
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 shrink-0 ${hasPendingCash ? "text-amber-600" : "text-blue-600"}`}
            />
            <span
              className={`text-sm font-semibold ${hasPendingCash ? "text-amber-800" : "text-blue-800"}`}
            >
              {hasPendingCash
                ? "Cash Payment Submitted"
                : "Online Payment In Progress"}
            </span>
          </div>
          <p
            className={`text-xs leading-relaxed ${hasPendingCash ? "text-amber-700" : "text-blue-700"}`}
          >
            {hasPendingCash
              ? (activePendingPayment.cashStatus
                  ? cashStatusLabels[activePendingPayment.cashStatus]
                  : "Payment submitted")
              : "Your payment session is active. Click \"Return to Payment\" to continue."}
          </p>
          <p className="text-xs font-mono text-slate-500 bg-white/70 px-2 py-0.5 rounded inline-block">
            {activePendingPayment.transactionId}
          </p>
        </div>
      )}

      {/* Failed attempt notice */}
      {hasFailedAttempt && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-xs text-red-700">
            A previous payment attempt failed. Please try again.
          </span>
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 gap-3">
        {/* Cash option */}
        <Card
          className={`border-2 transition-colors ${
            hasPendingCash
              ? "border-amber-300 bg-amber-50/40"
              : hasPendingOnline
                ? "border-slate-100 opacity-50"
                : "hover:border-amber-400"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    hasPendingCash ? "bg-amber-200" : "bg-amber-100"
                  }`}
                >
                  <Banknote
                    className={`w-5 h-5 ${hasPendingCash ? "text-amber-700" : "text-amber-600"}`}
                  />
                </div>
                <CardTitle className="text-base">Cash Payment</CardTitle>
              </div>
              {hasPendingCash && (
                <span className="text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                  Submitted
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-sm text-slate-500">
              {hasPendingCash
                ? "Your cash payment claim has been submitted. The worker must confirm receipt to complete the transaction."
                : "Pay the worker directly in cash. The worker will confirm receipt once payment is handed over."}
            </p>
            {!hasPendingCash && (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setCashDialogOpen(true)}
                disabled={hasPendingOnline || isOnlinePending}
              >
                <Banknote className="w-4 h-4 mr-2" />
                Pay with Cash
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Online option */}
        <Card
          className={`border-2 transition-colors ${
            hasPendingOnline
              ? "border-blue-300 bg-blue-50/40"
              : hasPendingCash
                ? "border-slate-100 opacity-50"
                : "hover:border-blue-400"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    hasPendingOnline ? "bg-blue-200" : "bg-blue-100"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 ${hasPendingOnline ? "text-blue-700" : "text-blue-600"}`}
                  />
                </div>
                <CardTitle className="text-base">Online Payment</CardTitle>
              </div>
              {hasPendingOnline && (
                <span className="text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-2 py-0.5">
                  In Progress
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-sm text-slate-500">
              {hasPendingOnline
                ? "Your payment session is active. Continue to the gateway to complete your transaction."
                : "Pay securely via SSLCommerz gateway. You will be redirected to complete the transaction."}
            </p>
            {onlineError && (
              <ServerErrorDisplay
                serverError={onlineError}
                setServerError={setOnlineError}
              />
            )}
            {!hasPendingCash && (
              <Button
                className="w-full"
                onClick={handleOnlinePayment}
                disabled={isCashPending || isOnlinePending}
              >
                {isOnlinePending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : hasPendingOnline ? (
                  <ExternalLink className="w-4 h-4 mr-2" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                {isOnlinePending
                  ? "Redirecting…"
                  : hasPendingOnline
                    ? "Return to Payment"
                    : "Pay Online"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cash confirmation dialog */}
      <Dialog
        open={cashDialogOpen}
        onOpenChange={(open) => {
          if (!isCashPending) {
            setCashDialogOpen(open);
            if (!open) setCashError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cash Payment</DialogTitle>
            <DialogDescription>
              This will record that you have paid{" "}
              <strong>৳ {formattedAmount}</strong> in cash to the worker. The
              worker will need to confirm receipt.
            </DialogDescription>
          </DialogHeader>

          {cashError && (
            <ServerErrorDisplay
              serverError={cashError}
              setServerError={setCashError}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCashDialogOpen(false)}
              disabled={isCashPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCashPayment} disabled={isCashPending}>
              {isCashPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isCashPending ? "Processing…" : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
