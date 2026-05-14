import type { Metadata } from "next";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getTaskApplicationsAction } from "@/actions/task/applyTaskAction";

export const metadata: Metadata = {
  title: "Task Applicants",
  description: "Review and manage applicants for your posted task.",
};
import { getMyPostedTaskAction } from "@/actions/task/taskAction";
import { TaskApplicationsClient } from "@/components/profile/tasks/TaskApplicationsClient";
import {
  ApplicationSortField,
  ApplicationStatusType,
  SortOrder,
  TaskApplicationsResponse,
} from "@/lib/types";

interface PageProps {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TaskApplicationsPage({ params, searchParams }: PageProps) {
  const { taskId } = await params;
  const sp = await searchParams;

  const page = Number(sp.page) || 1;
  const limit = Number(sp.limit) || 10;
  const sortBy = (sp.sortBy as ApplicationSortField) || "createdAt";
  const sortOrder = (sp.sortOrder as SortOrder) || "desc";
  const status =
    typeof sp.status === "string" ? (sp.status as ApplicationStatusType) : undefined;
  const searchTerm = typeof sp.searchTerm === "string" ? sp.searchTerm : undefined;

  const [taskResult, appsResult] = await Promise.all([
    getMyPostedTaskAction(taskId),
    getTaskApplicationsAction(taskId, { page, limit, sortBy, sortOrder, status, searchTerm }),
  ]);

  if (!appsResult.success) {
    return (
      <div className="space-y-4">
        <Link
          href={`/profile/tasks/${taskId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to task
        </Link>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Failed to load applications</p>
            <p className="text-sm mt-0.5 text-red-600">
              {"message" in appsResult ? appsResult.message : "An unexpected error occurred."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data: applications, meta } = appsResult as TaskApplicationsResponse;
  const taskTitle = taskResult.success && "data" in taskResult ? taskResult.data.title : "this task";
  const currentFilters = { page, limit, sortBy, sortOrder, status, searchTerm };

  return (
    <div className="space-y-5">
      <Link
        href={`/profile/tasks/${taskId}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to task
      </Link>

      <TaskApplicationsClient
        taskId={taskId}
        taskTitle={taskTitle}
        applications={applications}
        meta={meta}
        currentFilters={currentFilters}
      />
    </div>
  );
}
