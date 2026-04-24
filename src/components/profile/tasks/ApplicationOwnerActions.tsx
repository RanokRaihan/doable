"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApproveApplicationDialog } from "@/components/profile/tasks/ApproveApplicationDialog";
import { RejectApplicationDialog } from "@/components/profile/tasks/RejectApplicationDialog";
import { Button } from "@/components/ui/button";

interface ApplicationOwnerActionsProps {
  applicationId: string;
  applicantName: string;
}

export function ApplicationOwnerActions({
  applicationId,
  applicantName,
}: ApplicationOwnerActionsProps) {
  const router = useRouter();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const handleSuccess = () => router.refresh();

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setRejectOpen(true)}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
        <Button
          onClick={() => setApproveOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Approve
        </Button>
      </div>

      <ApproveApplicationDialog
        applicationId={applicationId}
        applicantName={applicantName}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={handleSuccess}
      />
      <RejectApplicationDialog
        applicationId={applicationId}
        applicantName={applicantName}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
