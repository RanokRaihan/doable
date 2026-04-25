"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Search, X } from "lucide-react";

import { TaskPagination } from "@/components/tasks/TaskPagination";
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
  MyApplication,
  PaginationMeta,
  SortOrder,
} from "@/lib/types";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationSort } from "./ApplicationSort";

interface CurrentFilters {
  page: number;
  limit: number;
  sortBy: ApplicationSortField;
  sortOrder: SortOrder;
  status: ApplicationStatusType | undefined;
}

interface ApplicationsClientProps {
  applications: MyApplication[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
}

const statusLabels: Record<ApplicationStatusType, string> = {
  PENDING:   "Pending",
  APPROVED:  "Approved",
  REJECTED:  "Rejected",
  WITHDRAWN: "Withdrawn",
};

export function ApplicationsClient({
  applications,
  meta,
  currentFilters,
}: ApplicationsClientProps) {
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

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleStatusChange = (value: string) =>
    updateURL({ status: value === "ALL" ? undefined : (value as ApplicationStatusType), page: 1 });

  const handleSortChange = (sortBy: ApplicationSortField, sortOrder: SortOrder) =>
    updateURL({ sortBy, sortOrder, page: 1 });

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => updateURL({ status: undefined, page: 1 });

  const handleWithdrawSuccess = () => {
    router.replace(pathname);
  };

  const hasActiveFilters = !!currentFilters.status;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Applications</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {meta.total} application{meta.total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <Link href="/tasks">
          <Button size="sm" variant="outline" className="shrink-0">
            Browse Tasks
          </Button>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status filter */}
        <Select
          value={currentFilters.status ?? "ALL"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-44 bg-white">
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

        <div className="flex gap-3 items-center">
          {/* Sort */}
          <ApplicationSort
            sortField={currentFilters.sortBy}
            sortOrder={currentFilters.sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Clear filters */}
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
        </div>
      )}

      {/* Application list or empty state */}
      {applications.length === 0 ? (
        hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <Search className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No applications match your filters
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your filters.
            </p>
            <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <FileText className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No applications yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Browse available tasks and apply to get started.
            </p>
            <Link href="/tasks">
              <Button className="mt-4">Browse Tasks</Button>
            </Link>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onActionSuccess={handleWithdrawSuccess}
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
