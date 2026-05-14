import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { MyTasksClient } from "@/components/profile/tasks/MyTasksClient";

export const metadata: Metadata = {
  title: "My Tasks",
  description: "Manage the tasks you have posted on Doable.",
};
import { getMyPostedTasksAction } from "@/actions/task/taskAction";
import {
  TasksResponse,
  SortField,
  SortOrder,
  TaskStatusType,
  TaskCategoryType,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MyTasksPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const sortBy = (params.sortBy as SortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const status =
    typeof params.status === "string"
      ? (params.status as TaskStatusType)
      : undefined;
  const category =
    typeof params.category === "string"
      ? (params.category as TaskCategoryType)
      : undefined;
  const searchTerm =
    typeof params.searchTerm === "string" ? params.searchTerm : undefined;

  const result = await getMyPostedTasksAction({
    page,
    limit,
    sortBy,
    sortOrder,
    status,
    category,
    searchTerm,
  });

  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load tasks</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in result ? result.message : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const { data: tasks, meta } = result as TasksResponse;
  const currentFilters = {
    page,
    limit,
    sortBy,
    sortOrder,
    status,
    category,
    searchTerm,
  };

  return (
    <MyTasksClient tasks={tasks} meta={meta} currentFilters={currentFilters} />
  );
}
