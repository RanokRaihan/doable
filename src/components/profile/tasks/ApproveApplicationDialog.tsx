"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import approveApplicationAction from "@/actions/application/approveApplicationAction";
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

interface ApproveApplicationDialogProps {
  applicationId: string;
  applicantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ApproveApplicationDialog({
  applicationId,
  applicantName,
  open,
  onOpenChange,
  onSuccess,
}: ApproveApplicationDialogProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setServerError(null);
    const result = await approveApplicationAction(applicationId);
    setIsApproving(false);

    if (!result.success) {
      const error = result as BackendError;
      setServerError(
        error.errorSources?.length ? error.errorSources[0].message : error.message,
      );
      return;
    }

    onOpenChange(false);
    toast.success("Application approved successfully.");
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isApproving) {
          onOpenChange(isOpen);
          if (!isOpen) setServerError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle>Approve Application</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to approve{" "}
            <span className="font-medium text-slate-700">{applicantName}</span>
            &apos;s application? This will notify the applicant.
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
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isApproving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Approving…
              </>
            ) : (
              "Approve"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
