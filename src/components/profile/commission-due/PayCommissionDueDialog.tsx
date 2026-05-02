"use client";

import { Loader2, Receipt } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import payCommissionDueAction from "@/actions/wallet/payCommissionDueAction";
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
import { BackendError } from "@/lib/api/types";

interface PayCommissionDueDialogProps {
  dueId: string;
  amount: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayCommissionDueDialog({
  dueId,
  amount,
  open,
  onOpenChange,
}: PayCommissionDueDialogProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handlePay = async () => {
    setIsPaying(true);
    setServerError(null);
    const result = await payCommissionDueAction(dueId);
    setIsPaying(false);

    if (!result.success) {
      const error = result as BackendError;
      setServerError(
        error.errorSources?.[0]?.message ?? error.message ?? "Failed to process payment.",
      );
      return;
    }

    onOpenChange(false);
    toast.success("Commission paid successfully.");
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isPaying) {
          onOpenChange(isOpen);
          if (!isOpen) setServerError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5 text-indigo-600" />
            </div>
            <DialogTitle>Pay Commission</DialogTitle>
          </div>
          <DialogDescription>
            You are about to pay{" "}
            <span className="font-semibold text-slate-700">৳ {amount}</span> in
            platform commission. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <ServerErrorDisplay
            serverError={serverError}
            setServerError={setServerError}
          />
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPaying}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            disabled={isPaying}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isPaying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing…
              </>
            ) : (
              <>
                <Receipt className="h-4 w-4 mr-2" />
                Pay Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
