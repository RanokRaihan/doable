"use client";

import {
  AlertCircle,
  ClipboardList,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { MyTaskCard } from "@/components/profile/tasks/MyTaskCard";
import { TaskPagination } from "@/components/tasks/TaskPagination";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { TaskSort } from "@/components/tasks/TaskSort";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskStatusConfig } from "@/lib/taskStatusConfig";
import {
  PaginationMeta,
  SortField,
  SortOrder,
  Task,
  TaskCategory,
  TaskCategoryType,
  TaskStatus,
  TaskStatusType,
} from "@/lib/types";

interface CurrentFilters {
  page: number;
  limit: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  status: TaskStatusType | undefined;
  category: TaskCategoryType | undefined;
  searchTerm: string | undefined;
}

interface MyTasksClientProps {
  tasks: Task[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
}

// const statusLabels: Record<TaskStatusType, string> = {
//   OPEN: "Open",
//   IN_PROGRESS: "In Progress",
//   COMPLETED: "Completed",
//   CANCELLED: "Cancelled",
//   PAYMENT_PROCESSING: "Payment Processing",
// };

const categoryLabels: Record<TaskCategoryType, string> = {
  DELIVERY: "Delivery",
  CLEANING: "Cleaning",
  REPAIR: "Repair",
  TUTORING: "Tutoring",
  GARDENING: "Gardening",
  MOVING: "Moving",
  PET_CARE: "Pet Care",
  TECH_SUPPORT: "Tech Support",
  OTHER: "Other",
};

export function MyTasksClient({
  tasks,
  meta,
  currentFilters,
}: MyTasksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function updateURL(updates: Partial<CurrentFilters>) {
    const merged = { ...currentFilters, ...updates };
    const params = new URLSearchParams();

    if (merged.page !== 1) params.set("page", String(merged.page));
    if (merged.limit !== 10) params.set("limit", String(merged.limit));
    if (merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy);
    if (merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);
    if (merged.status) params.set("status", merged.status);
    if (merged.category) params.set("category", merged.category);
    if (merged.searchTerm) params.set("searchTerm", merged.searchTerm);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleSearch = (value: string) =>
    updateURL({ searchTerm: value || undefined, page: 1 });

  const handleStatusChange = (value: string) =>
    updateURL({
      status: value === "ALL" ? undefined : (value as TaskStatusType),
      page: 1,
    });

  const handleCategoryChange = (value: string) =>
    updateURL({
      category: value === "ALL" ? undefined : (value as TaskCategoryType),
      page: 1,
    });

  const handleSortChange = (sortBy: SortField, sortOrder: SortOrder) =>
    updateURL({ sortBy, sortOrder, page: 1 });

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () =>
    updateURL({
      status: undefined,
      category: undefined,
      searchTerm: undefined,
      page: 1,
    });

  const handleEdit = (taskId: string) => {
    router.push(`/profile/tasks/edit/${taskId}`);
  };

  const handleDeleteRequest = (taskId: string) => {
    setDeleteTargetId(taskId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      // TODO: wire up deleteTaskAction when available
      toast.info("Delete functionality coming soon.");
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const hasActiveFilters = !!(
    currentFilters.status ||
    currentFilters.category ||
    currentFilters.searchTerm
  );

  return (
    <>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              My Posted Tasks
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {meta.total} task{meta.total !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link href="/post-task">
            <Button size="sm" className="shrink-0">
              <Plus className="h-4 w-4 mr-1.5" />
              Post New Task
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <TaskSearch
            value={currentFilters.searchTerm ?? ""}
            onChange={handleSearch}
            placeholder="Search your tasks..."
            className="flex-1 min-w-0"
          />

          <div className="flex flex-wrap gap-3">
            {/* Status filter */}
            <Select
              value={currentFilters.status ?? "ALL"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.values(TaskStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {taskStatusConfig[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category filter */}
            <Select
              value={currentFilters.category ?? "ALL"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {Object.values(TaskCategory).map((c) => (
                  <SelectItem key={c} value={c}>
                    {categoryLabels[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <TaskSort
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
                {taskStatusConfig[currentFilters.status].label}
                <button
                  onClick={() => updateURL({ status: undefined, page: 1 })}
                  className="rounded-full hover:bg-slate-300 transition-colors p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {currentFilters.category && (
              <Badge variant="secondary" className="gap-1.5 pr-1.5">
                {categoryLabels[currentFilters.category]}
                <button
                  onClick={() => updateURL({ category: undefined, page: 1 })}
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

        {/* Task list */}
        {tasks.length === 0 ? (
          hasActiveFilters ? (
            /* Filtered empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <Search className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                No tasks match your filters
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your search or filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            /* No tasks at all */
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <ClipboardList className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                No tasks yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                You haven&apos;t posted any tasks. Get started by posting your
                first task.
              </p>
              <Link href="/post-task">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Post a Task
                </Button>
              </Link>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <MyTaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
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

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Task
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTargetId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
