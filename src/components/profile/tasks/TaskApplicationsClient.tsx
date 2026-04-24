"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, Search, X } from "lucide-react";

import { TaskSearch } from "@/components/tasks/TaskSearch";
import { TaskPagination } from "@/components/tasks/TaskPagination";
import { ApplicationSort } from "@/components/profile/applications/ApplicationSort";
import { TaskApplicationCard } from "@/components/profile/tasks/TaskApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApplicationSortField,
  ApplicationStatus,
  ApplicationStatusType,
  PaginationMeta,
  SortOrder,
  TaskApplicationDetail,
} from "@/lib/types";

interface CurrentFilters {
  page: number;
  limit: number;
  sortBy: ApplicationSortField;
  sortOrder: SortOrder;
  status: ApplicationStatusType | undefined;
  searchTerm: string | undefined;
}

interface TaskApplicationsClientProps {
  taskId: string;
  taskTitle: string;
  applications: TaskApplicationDetail[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
}

const statusLabels: Record<ApplicationStatusType, string> = {
  PENDING:   "Pending",
  APPROVED:  "Approved",
  REJECTED:  "Rejected",
  WITHDRAWN: "Withdrawn",
};

export function TaskApplicationsClient({
  taskId,
  taskTitle,
  applications,
  meta,
  currentFilters,
}: TaskApplicationsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  function updateURL(updates: Partial<CurrentFilters>) {
    const merged = { ...currentFilters, ...updates };
    const params = new URLSearchParams();

    if (merged.page !== 1) params.set("page", String(merged.page));
    if (merged.limit !== 10) params.set("limit", String(merged.limit));
    if (merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy);
    if (merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);
    if (merged.status) params.set("status", merged.status);
    if (merged.searchTerm) params.set("searchTerm", merged.searchTerm);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleSearch = (value: string) =>
    updateURL({ searchTerm: value || undefined, page: 1 });

  const handleStatusChange = (value: string) =>
    updateURL({ status: value === "ALL" ? undefined : (value as ApplicationStatusType), page: 1 });

  const handleSortChange = (sortBy: ApplicationSortField, sortOrder: SortOrder) =>
    updateURL({ sortBy, sortOrder, page: 1 });

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () =>
    updateURL({ status: undefined, searchTerm: undefined, page: 1 });

  const handleActionSuccess = () => router.replace(pathname);

  const hasActiveFilters = !!(currentFilters.status || currentFilters.searchTerm);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
          <Users className="h-5 w-5 text-violet-600" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5 truncate">
            {meta.total} applicant{meta.total !== 1 ? "s" : ""} for &ldquo;{taskTitle}&rdquo;
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <TaskSearch
          value={currentFilters.searchTerm ?? ""}
          onChange={handleSearch}
          placeholder="Search applicants or messages..."
          className="flex-1 min-w-0"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={currentFilters.status ?? "ALL"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(ApplicationStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ApplicationSort
            sortField={currentFilters.sortBy}
            sortOrder={currentFilters.sortOrder}
            onSortChange={handleSortChange}
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-slate-500 hover:text-slate-900"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentFilters.status && (
            <Badge variant="secondary" className="gap-1.5 pr-1.5">
              {statusLabels[currentFilters.status]}
              <button
                onClick={() => updateURL({ status: undefined, page: 1 })}
                className="rounded-full hover:bg-slate-300 transition-colors p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.searchTerm && (
            <Badge variant="secondary" className="gap-1.5 pr-1.5">
              &ldquo;{currentFilters.searchTerm}&rdquo;
              <button
                onClick={() => updateURL({ searchTerm: undefined, page: 1 })}
                className="rounded-full hover:bg-slate-300 transition-colors p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Application list or empty state */}
      {applications.length === 0 ? (
        hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <Search className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No applications match your filters</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
            <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <Users className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No applications yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              No one has applied to this task yet. Check back later.
            </p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <TaskApplicationCard
              key={application.id}
              application={application}
              taskId={taskId}
              onActionSuccess={handleActionSuccess}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.total > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <TaskPagination meta={meta} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
