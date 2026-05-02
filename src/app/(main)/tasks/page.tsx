import { getAllTasksAction } from "@/actions/task/taskAction";
import TaskCard from "@/components/common/TaskCard";
import { FiltersBarSkeleton } from "@/components/tasks/browse/FiltersBarSkeleton";
import { TasksControlBar } from "@/components/tasks/browse/TasksControlBar";
import { TasksUrlPagination } from "@/components/tasks/browse/TasksUrlPagination";
import { Button } from "@/components/ui/button";
import {
  SortField,
  SortOrder,
  TaskCategoryType,
  TaskPriorityType,
} from "@/lib/types";
import { AlertCircle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AllTasksPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Number(params.limit) || 9;
  const sortBy = (params.sortBy as SortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const searchTerm =
    typeof params.searchTerm === "string" && params.searchTerm
      ? params.searchTerm
      : undefined;

  const rawCategories =
    typeof params.category === "string"
      ? (params.category.split(",").filter(Boolean) as TaskCategoryType[])
      : [];
  const rawPriorities =
    typeof params.priority === "string"
      ? (params.priority.split(",").filter(Boolean) as TaskPriorityType[])
      : [];

  // Send to API only when single value (backend constraint)
  const apiCategory = rawCategories.length === 1 ? rawCategories[0] : undefined;
  const apiPriority = rawPriorities.length === 1 ? rawPriorities[0] : undefined;

  const result = await getAllTasksAction({
    page,
    limit,
    sortBy,
    sortOrder,
    category: apiCategory,
    priority: apiPriority,
    searchTerm,
  });

  const hasFilters = !!(rawCategories.length || rawPriorities.length || searchTerm);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-20">
        <PageHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {result.message || "Failed to load tasks. Please try again."}
            </p>
            <Button asChild variant="outline">
              <Link href="/tasks">Try again</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  let tasks = result.data ?? [];
  const meta = result.meta;

  // Client-side multi-filter when 2+ values selected (backend only accepts one)
  if (rawCategories.length > 1) {
    tasks = tasks.filter((t) => rawCategories.includes(t.category));
  }
  if (rawPriorities.length > 1) {
    tasks = tasks.filter((t) => rawPriorities.includes(t.priority));
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PageHeader />
          <div className="mt-5">
            <Suspense fallback={<FiltersBarSkeleton />}>
              <TasksControlBar />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {meta.total === 0 ? (
            "No tasks found"
          ) : (
            <>
              Found{" "}
              <span className="font-semibold text-foreground">{meta.total}</span>{" "}
              task{meta.total !== 1 ? "s" : ""}
              {hasFilters && " matching your criteria"}
            </>
          )}
        </p>

        {/* Grid or empty state */}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {hasFilters ? "No tasks match your criteria" : "No tasks available right now"}
            </h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              {hasFilters
                ? "Try adjusting your filters or search terms."
                : "Check back soon for new tasks."}
            </p>
            {hasFilters && (
              <Button asChild variant="outline">
                <Link href="/tasks">Clear filters</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.total > 0 && (
          <div className="mt-8 border-t border-gray-100 pt-4">
            <Suspense fallback={null}>
              <TasksUrlPagination meta={meta} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Browse Tasks
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Find tasks that match your skills and availability
        </p>
      </div>
      <Button asChild size="sm">
        <Link href="/post-task">Post a Task</Link>
      </Button>
    </div>
  );
}
