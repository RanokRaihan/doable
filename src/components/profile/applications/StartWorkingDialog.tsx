"use client";

import { Loader2, PlayCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import markTaskInProgressAction from "@/actions/task/markTaskInProgressAction";
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

interface StartWorkingDialogProps {
  taskId: string;
  taskTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StartWorkingDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
  onSuccess,
}: StartWorkingDialogProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleStart = async () => {
    setIsStarting(true);
    setServerError(null);
    const result = await markTaskInProgressAction(taskId);
    setIsStarting(false);

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
    toast.success("You are now working on this task.");
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isStarting) {
          onOpenChange(isOpen);
          if (!isOpen) setServerError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <PlayCircle className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle>Start Working</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to start working on{" "}
            <span className="font-medium text-slate-700">
              &ldquo;{taskTitle}&rdquo;
            </span>
            ? This will mark the task as In Progress.
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
            disabled={isStarting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={isStarting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Starting…
              </>
            ) : (
              "Start Working"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
