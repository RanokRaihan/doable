"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApproveCompletionDialog } from "./ApproveCompletionDialog";
import { RequestRevisionDialog } from "./RequestRevisionDialog";

interface OwnerPendingReviewActionsProps {
  taskId: string;
  taskTitle: string;
  stacked?: boolean;
}

export function OwnerPendingReviewActions({
  taskId,
  taskTitle,
  stacked = false,
}: OwnerPendingReviewActionsProps) {
  const router = useRouter();
  const [approveOpen, setApproveOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);

  const handleSuccess = () => router.refresh();

  return (
    <>
      <div className={stacked ? "flex flex-col gap-2" : "flex items-center gap-2"}>
        <Button
          variant="outline"
          onClick={() => setRevisionOpen(true)}
          className={`text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300${stacked ? " w-full" : ""}`}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Request Revision
        </Button>
        <Button
          onClick={() => setApproveOpen(true)}
          className={`bg-green-600 hover:bg-green-700 text-white${stacked ? " w-full" : ""}`}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Approve Completion
        </Button>
      </div>

      <ApproveCompletionDialog
        taskId={taskId}
        taskTitle={taskTitle}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={handleSuccess}
      />
      <RequestRevisionDialog
        taskId={taskId}
        taskTitle={taskTitle}
        open={revisionOpen}
        onOpenChange={setRevisionOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
