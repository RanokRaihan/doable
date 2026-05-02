"use client";

import { CheckCircle2, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApplicationStatusType, TaskStatusType } from "@/lib/types";
import { MarkCompletedDialog } from "./MarkCompletedDialog";
import { StartWorkingDialog } from "./StartWorkingDialog";

interface ApplicationDetailActionsProps {
  taskId: string;
  taskTitle: string;
  applicationStatus: ApplicationStatusType;
  taskStatus: TaskStatusType;
}

export function ApplicationDetailActions({
  taskId,
  taskTitle,
  applicationStatus,
  taskStatus,
}: ApplicationDetailActionsProps) {
  const router = useRouter();
  const [startOpen, setStartOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const showStartWorking =
    applicationStatus === "APPROVED" && taskStatus === "ASSIGNED";
  const showMarkCompleted =
    applicationStatus === "APPROVED" && taskStatus === "IN_PROGRESS";

  if (!showStartWorking && !showMarkCompleted) return null;

  const handleSuccess = () => router.refresh();

  return (
    <>
      <div className="flex items-center gap-2">
        {showStartWorking && (
          <Button
            onClick={() => setStartOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Working
          </Button>
        )}
        {showMarkCompleted && (
          <Button
            onClick={() => setCompleteOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Completed
          </Button>
        )}
      </div>

      <StartWorkingDialog
        taskId={taskId}
        taskTitle={taskTitle}
        open={startOpen}
        onOpenChange={setStartOpen}
        onSuccess={handleSuccess}
      />
      <MarkCompletedDialog
        taskId={taskId}
        taskTitle={taskTitle}
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
