"use client";

import { ChevronDown, Receipt, SortAsc, SortDesc, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { CommissionDueCard } from "@/components/profile/commission-due/CommissionDueCard";
import { TaskPagination } from "@/components/tasks/TaskPagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommissionDue, CommissionDueSortField, PaginationMeta, SortOrder } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CurrentFilters {
  page: number;
  limit: number;
  sortBy: CommissionDueSortField;
  sortOrder: SortOrder;
}

interface CommissionsDueClientProps {
  commissions: CommissionDue[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
}

const sortFieldOptions: {
  value: CommissionDueSortField;
  label: string;
}[] = [
  { value: "createdAt", label: "Date Created" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "amount",    label: "Amount" },
];

export function CommissionsDueClient({
  commissions,
  meta,
  currentFilters,
}: CommissionsDueClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  function updateURL(updates: Partial<CurrentFilters>) {
    const merged = { ...currentFilters, ...updates };
    const params = new URLSearchParams();

    if (merged.page !== 1) params.set("page", String(merged.page));
    if (merged.limit !== 10) params.set("limit", String(merged.limit));
    if (merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy);
    if (merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleSortFieldChange = (field: CommissionDueSortField) =>
    updateURL({ sortBy: field, page: 1 });

  const handleSortOrderToggle = () =>
    updateURL({
      sortOrder: currentFilters.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentOption = sortFieldOptions.find(
    (f) => f.value === currentFilters.sortBy,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <Receipt className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Commission Due</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {meta.total} record{meta.total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-40 justify-between">
              {currentOption?.label ?? "Sort by"}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortFieldOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortFieldChange(option.value)}
                className="cursor-pointer"
              >
                <span className="flex-1">{option.label}</span>
                {currentFilters.sortBy === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="icon"
          onClick={handleSortOrderToggle}
          className={cn(
            "shrink-0",
            currentFilters.sortOrder === "desc" && "bg-primary/5 border-primary/30",
          )}
          title={currentFilters.sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {currentFilters.sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>

      {commissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <Receipt className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">
            No commission records
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Commission dues will appear here after you complete tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {commissions.map((due) => (
            <CommissionDueCard key={due.id} due={due} />
          ))}
        </div>
      )}

      {meta.total > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <TaskPagination meta={meta} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
