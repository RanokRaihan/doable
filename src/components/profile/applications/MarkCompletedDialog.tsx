"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import markTaskCompletedAction from "@/actions/task/markTaskCompletedAction";
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

interface MarkCompletedDialogProps {
  taskId: string;
  taskTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MarkCompletedDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
  onSuccess,
}: MarkCompletedDialogProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleComplete = async () => {
    setIsCompleting(true);
    setServerError(null);
    const result = await markTaskCompletedAction(taskId);
    setIsCompleting(false);

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
    toast.success("Task marked as completed successfully.");
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isCompleting) {
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
            <DialogTitle>Mark as Completed</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to mark{" "}
            <span className="font-medium text-slate-700">
              &ldquo;{taskTitle}&rdquo;
            </span>{" "}
            as completed? This cannot be undone.
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
            disabled={isCompleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isCompleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Completing…
              </>
            ) : (
              "Mark Completed"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
