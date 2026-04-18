import { AlertCircle } from "lucide-react";

import { getMyApplicationsAction } from "@/actions/task/applyTaskAction";
import { ApplicationsClient } from "@/components/profile/applications/ApplicationsClient";
import { ApiResponse } from "@/lib/api/types";
import { MyApplication } from "@/lib/types";

export default async function ApplicationsPage() {
  const result = await getMyApplicationsAction();

  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load applications</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in result ? result.message : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const applications = (result as ApiResponse<MyApplication[]>).data;
  return <ApplicationsClient initialApplications={applications} />;
}
