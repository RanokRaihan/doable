"use client";

import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import rejectApplicationAction from "@/actions/application/rejectApplicationAction";
import { useAppForm } from "@/components/form/hooks";
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
import RejectApplicationSchema, {
  RejectApplicationFormData,
} from "@/schema/rejectApplicationValidation";
import { useState } from "react";

interface RejectApplicationDialogProps {
  applicationId: string;
  applicantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RejectApplicationDialog({
  applicationId,
  applicantName,
  open,
  onOpenChange,
  onSuccess,
}: RejectApplicationDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { rejectionReason: "" } as RejectApplicationFormData,
    validators: { onSubmit: RejectApplicationSchema },
    onSubmit: async ({ value }) => {
      const result = await rejectApplicationAction(
        applicationId,
        value.rejectionReason,
      );
      if (!result.success) {
        const error = result as BackendError;
        setServerError(
          error.errorSources?.length
            ? error.errorSources[0].message
            : error.message,
        );
        return;
      }
      onOpenChange(false);
      form.reset();
      toast.success("Application rejected.");
      onSuccess();
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setServerError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Reject Application</DialogTitle>
          </div>
          <DialogDescription>
            Please provide a reason for rejecting{" "}
            <span className="font-medium text-slate-700">{applicantName}</span>
            &apos;s application.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField name="rejectionReason">
            {(field) => (
              <field.TextAreaField
                label="Reason for rejection"
                placeholder="Explain why this application is being rejected…"
                rows={4}
              />
            )}
          </form.AppField>

          {serverError && (
            <ServerErrorDisplay
              serverError={serverError}
              setServerError={setServerError}
            />
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Rejecting…
                    </>
                  ) : (
                    "Reject"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
