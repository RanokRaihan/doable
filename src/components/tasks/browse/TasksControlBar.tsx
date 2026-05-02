"use client";

import {
  ActiveFilters,
  MultiSelectFilter,
} from "@/components/tasks/TaskFilters";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { TaskSort } from "@/components/tasks/TaskSort";
import { Button } from "@/components/ui/button";
import {
  SortField,
  SortOrder,
  TaskCategory,
  TaskCategoryType,
  TaskPriority,
  TaskPriorityType,
} from "@/lib/types";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Box,
  Briefcase,
  ClipboardList,
  Dog,
  Flower2,
  Laptop,
  RefreshCw,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const categoryOptions = [
  {
    value: TaskCategory.DELIVERY,
    label: "Delivery",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    value: TaskCategory.CLEANING,
    label: "Cleaning",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    value: TaskCategory.REPAIR,
    label: "Repair",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    value: TaskCategory.TUTORING,
    label: "Tutoring",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    value: TaskCategory.GARDENING,
    label: "Gardening",
    icon: <Flower2 className="h-4 w-4" />,
  },
  {
    value: TaskCategory.MOVING,
    label: "Moving",
    icon: <Box className="h-4 w-4" />,
  },
  {
    value: TaskCategory.PET_CARE,
    label: "Pet Care",
    icon: <Dog className="h-4 w-4" />,
  },
  {
    value: TaskCategory.TECH_SUPPORT,
    label: "Tech Support",
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    value: TaskCategory.OTHER,
    label: "Other",
    icon: <ClipboardList className="h-4 w-4" />,
  },
];

const priorityOptions = [
  {
    value: TaskPriority.URGENT,
    label: "Urgent",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  {
    value: TaskPriority.HIGH,
    label: "High",
    icon: <ArrowUp className="h-4 w-4 text-orange-500" />,
  },
  {
    value: TaskPriority.MEDIUM,
    label: "Medium",
    icon: (
      <span className="h-4 w-4 flex items-center justify-center text-yellow-500">
        ●
      </span>
    ),
  },
  {
    value: TaskPriority.LOW,
    label: "Low",
    icon: <ArrowDown className="h-4 w-4 text-green-500" />,
  },
];

type URLUpdates = {
  page?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  searchTerm?: string;
  category?: string;
  priority?: string;
};

export function TasksControlBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSearch = searchParams.get("searchTerm") ?? "";
  const currentSortBy =
    (searchParams.get("sortBy") as SortField) ?? "createdAt";
  const currentSortOrder =
    (searchParams.get("sortOrder") as SortOrder) ?? "desc";
  const currentCategories = useMemo(
    () =>
      searchParams.get("category")
        ? (searchParams
            .get("category")!
            .split(",")
            .filter(Boolean) as TaskCategoryType[])
        : [],
    [searchParams],
  );
  const currentPriorities = useMemo(
    () =>
      searchParams.get("priority")
        ? (searchParams
            .get("priority")!
            .split(",")
            .filter(Boolean) as TaskPriorityType[])
        : [],
    [searchParams],
  );

  const updateURL = useCallback(
    (updates: URLUpdates) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // Strip defaults from URL
      if (current.get("page") === "1") current.delete("page");
      if (current.get("sortBy") === "createdAt") current.delete("sortBy");
      if (current.get("sortOrder") === "desc") current.delete("sortOrder");

      const query = current.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router],
  );

  const handleSearchChange = useCallback(
    (val: string) => updateURL({ searchTerm: val || undefined, page: 1 }),
    [updateURL],
  );

  const handleCategoryChange = useCallback(
    (vals: string[]) =>
      updateURL({
        category: vals.length ? vals.join(",") : undefined,
        page: 1,
      }),
    [updateURL],
  );

  const handlePriorityChange = useCallback(
    (vals: string[]) =>
      updateURL({
        priority: vals.length ? vals.join(",") : undefined,
        page: 1,
      }),
    [updateURL],
  );

  const handleSortChange = useCallback(
    (field: SortField, order: SortOrder) =>
      updateURL({ sortBy: field, sortOrder: order }),
    [updateURL],
  );

  const handleRemoveCategory = useCallback(
    (cat: string) => {
      const next = currentCategories.filter((c) => c !== cat);
      updateURL({
        category: next.length ? next.join(",") : undefined,
        page: 1,
      });
    },
    [currentCategories, updateURL],
  );

  const handleRemovePriority = useCallback(
    (pri: string) => {
      const next = currentPriorities.filter((p) => p !== pri);
      updateURL({
        priority: next.length ? next.join(",") : undefined,
        page: 1,
      });
    },
    [currentPriorities, updateURL],
  );

  const handleClearAll = useCallback(
    () =>
      updateURL({
        searchTerm: undefined,
        category: undefined,
        priority: undefined,
        page: 1,
      }),
    [updateURL],
  );

  const isLoading = false;

  return (
    <div className="space-y-3">
      {/* Single control row: search | filters | sort */}
      <div className="flex flex-wrap items-center gap-2">
        <TaskSearch
          value={currentSearch}
          onChange={handleSearchChange}
          placeholder="Search by title, description, or location..."
          className="flex-1 min-w-45"
        />
        <MultiSelectFilter
          title="Category"
          options={categoryOptions}
          selectedValues={currentCategories}
          onSelectionChange={handleCategoryChange}
        />
        <MultiSelectFilter
          title="Priority"
          options={priorityOptions}
          selectedValues={currentPriorities}
          onSelectionChange={handlePriorityChange}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.refresh()}
          className="shrink-0"
          title="Refresh results"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
        <TaskSort
          sortField={currentSortBy}
          sortOrder={currentSortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Active filter chips */}
      <ActiveFilters
        categories={currentCategories}
        priorities={currentPriorities}
        onRemoveCategory={handleRemoveCategory}
        onRemovePriority={handleRemovePriority}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
