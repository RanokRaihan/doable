"use client";

import { applyTaskAction } from "@/actions/task/applyTaskAction";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplyTaskSchema, {
  ApplyTaskFormData,
} from "@/schema/applyTaskValidation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApplyTaskDialogProps {
  taskId: string;
}

export function ApplyTaskDialog({ taskId }: ApplyTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      message: "",
      proposedCompensation: 0,
    } as ApplyTaskFormData,
    validators: {
      onSubmit: ApplyTaskSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await applyTaskAction(taskId, value);
      if (!result.success) {
        toast.error("message" in result ? result.message : "Failed to apply");
        return;
      }
      toast.success("Application submitted successfully!");
      setOpen(false);
      form.reset();
    },
  });

  return (
    <>
      <Button
        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        Apply Now
      </Button>

      <p className="text-xs text-center text-gray-500">
        By applying, you agree to our Terms of Service
      </p>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) form.reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for this Task</DialogTitle>
            <DialogDescription>
              Submit your application with a message and proposed compensation.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.AppField name="message">
              {(field) => (
                <field.TextAreaField
                  label="Message"
                  placeholder="Describe why you're the right person for this task…"
                  rows={4}
                />
              )}
            </form.AppField>

            <form.AppField name="proposedCompensation">
              {(field) => (
                <field.NumberInputField
                  label="Proposed Compensation"
                  placeholder="80"
                  prefix="$"
                  min={1}
                />
              )}
            </form.AppField>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
