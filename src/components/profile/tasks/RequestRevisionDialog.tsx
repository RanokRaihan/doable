"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import requestRevisionAction from "@/actions/task/requestRevisionAction";
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

interface RequestRevisionDialogProps {
  taskId: string;
  taskTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RequestRevisionDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
  onSuccess,
}: RequestRevisionDialogProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleRequestRevision = async () => {
    setIsRequesting(true);
    setServerError(null);
    const result = await requestRevisionAction(taskId);
    setIsRequesting(false);

    if (!result.success) {
      const error = result as BackendError;
      setServerError(
        error.errorSources?.length ? error.errorSources[0].message : error.message,
      );
      return;
    }

    onOpenChange(false);
    toast.success("Revision requested. Task is back in progress.");
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isRequesting) {
          onOpenChange(isOpen);
          if (!isOpen) setServerError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle>Request Revision</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to request a revision for{" "}
            <span className="font-medium text-slate-700">&quot;{taskTitle}&quot;</span>?
            The task will return to In Progress.
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
            disabled={isRequesting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequestRevision}
            disabled={isRequesting}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isRequesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Requesting…
              </>
            ) : (
              "Request Revision"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
