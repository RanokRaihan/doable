"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import cancelWithdrawalRequestAction from "@/actions/withdrawal/cancelWithdrawalRequestAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelWithdrawalRequestDialogProps {
  requestId: string;
  amount: string;
  children: React.ReactNode;
}

function formatAmount(amount: string) {
  const num = parseFloat(amount);
  return `৳ ${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CancelWithdrawalRequestDialog({
  requestId,
  amount,
  children,
}: CancelWithdrawalRequestDialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async (e: React.MouseEvent) => {
    if (reason.trim().length < 10) {
      e.preventDefault();
      setError("Please provide at least 10 characters.");
      return;
    }
    setIsLoading(true);
    const result = await cancelWithdrawalRequestAction(requestId, {
      cancellationReason: reason.trim(),
    });
    setIsLoading(false);

    if (result.success) {
      toast.success(
        `Withdrawal cancelled. ${formatAmount(amount)} will be credited back to your wallet.`,
      );
      router.push("/profile/withdrawal/requests");
    } else {
      toast.error(
        "errorSources" in result && result.errorSources
          ? result.errorSources[0].message
          : "Failed to cancel withdrawal request",
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Withdrawal Request?</AlertDialogTitle>
          <AlertDialogDescription>
            This withdrawal request will be cancelled and{" "}
            <span className="font-semibold text-slate-800">
              {formatAmount(amount)}
            </span>{" "}
            will be credited back to your wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <Label
            htmlFor="cancellationReason"
            className="text-sm text-slate-700"
          >
            Reason (required, min 10 characters)
          </Label>
          <Textarea
            id="cancellationReason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Why are you cancelling this request?"
            maxLength={500}
            rows={3}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-slate-400">{reason.length}/500</p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Keep Request
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Cancelling…" : "Cancel Request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
