"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const handleCancel = async () => {
    setIsLoading(true);
    const result = await cancelWithdrawalRequestAction(requestId, {
      cancellationReason: reason.trim() || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      toast.success(
        `Withdrawal cancelled. ${formatAmount(amount)} will be credited back to your wallet.`,
      );
      router.push("/profile/withdrawal/requests");
    } else {
      toast.error(
        "message" in result
          ? result.message
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
          <Label htmlFor="cancellationReason" className="text-sm text-slate-700">
            Reason (optional)
          </Label>
          <Textarea
            id="cancellationReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you cancelling this request?"
            maxLength={500}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-slate-400 text-right">
            {reason.length}/500
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Keep Request</AlertDialogCancel>
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
