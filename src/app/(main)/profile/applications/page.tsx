import { AlertCircle } from "lucide-react";

import { getMyApplicationsAction } from "@/actions/task/applyTaskAction";
import { ApplicationsClient } from "@/components/profile/applications/ApplicationsClient";
import {
  ApplicationSortField,
  ApplicationStatusType,
  ApplicationsResponse,
  SortOrder,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const sortBy = (params.sortBy as ApplicationSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const status =
    typeof params.status === "string"
      ? (params.status as ApplicationStatusType)
      : undefined;

  const result = await getMyApplicationsAction({
    page,
    limit,
    sortBy,
    sortOrder,
    status,
  });
  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load applications</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in result
              ? result.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }
  console.log("applications result: ", result.data[0].task);
  const { data: applications, meta } = result as ApplicationsResponse;
  const currentFilters = { page, limit, sortBy, sortOrder, status };

  return (
    <ApplicationsClient
      applications={applications}
      meta={meta}
      currentFilters={currentFilters}
    />
  );
}
