"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Banknote, CreditCard, Loader2 } from "lucide-react";

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

interface PaymentMethodSelectorProps {
  taskId: string;
  agreedCompensation: string;
}

export function PaymentMethodSelector({
  taskId,
  agreedCompensation,
}: PaymentMethodSelectorProps) {
  const router = useRouter();
  const [cashDialogOpen, setCashDialogOpen] = useState(false);
  const [isCashPending, setIsCashPending] = useState(false);
  const [isOnlinePending, setIsOnlinePending] = useState(false);
  const [cashError, setCashError] = useState<string | null>(null);
  const [onlineError, setOnlineError] = useState<string | null>(null);

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
      <div className="rounded-xl border bg-emerald-50 border-emerald-200 px-5 py-4 flex items-center justify-between">
        <span className="text-sm font-medium text-emerald-700">
          Payment Amount
        </span>
        <span className="text-xl font-bold text-emerald-800">
          ৳ {formattedAmount}
        </span>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-3">
        {/* Cash option */}
        <Card className="border-2 hover:border-amber-400 transition-colors cursor-default">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5 text-amber-600" />
              </div>
              <CardTitle className="text-base">Cash Payment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-sm text-slate-500">
              Pay the worker directly in cash. The worker will confirm receipt
              once payment is handed over.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setCashDialogOpen(true)}
              disabled={isOnlinePending}
            >
              <Banknote className="w-4 h-4 mr-2" />
              Pay with Cash
            </Button>
          </CardContent>
        </Card>

        {/* Online option */}
        <Card className="border-2 hover:border-blue-400 transition-colors cursor-default">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-base">Online Payment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-sm text-slate-500">
              Pay securely via SSLCommerz gateway. You will be redirected to
              complete the transaction.
            </p>
            {onlineError && (
              <ServerErrorDisplay
                serverError={onlineError}
                setServerError={setOnlineError}
              />
            )}
            <Button
              className="w-full"
              onClick={handleOnlinePayment}
              disabled={isCashPending || isOnlinePending}
            >
              {isOnlinePending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              {isOnlinePending ? "Redirecting…" : "Pay Online"}
            </Button>
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
