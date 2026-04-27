"use client";

import { Check, CreditCard, Search, SortAsc, SortDesc } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { PaymentCard } from "@/components/profile/payments/PaymentCard";
import { TaskPagination } from "@/components/tasks/TaskPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  PaginationMeta,
  PaymentMadeItem,
  PaymentMethodType,
  PaymentSortField,
  SortOrder,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface CurrentFilters {
  page: number;
  limit: number;
  sortBy: PaymentSortField;
  sortOrder: SortOrder;
  method?: PaymentMethodType;
}

interface PaymentsMadeClientProps {
  payments: PaymentMadeItem[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
}

const sortFieldOptions: { value: PaymentSortField; label: string }[] = [
  { value: "createdAt", label: "Date Created" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "amount",    label: "Amount" },
];

const methodOptions: { value: PaymentMethodType | undefined; label: string }[] = [
  { value: undefined,  label: "All Methods" },
  { value: "ONLINE",   label: "Online" },
  { value: "CASH",     label: "Cash" },
];

export function PaymentsMadeClient({
  payments,
  meta,
  currentFilters,
}: PaymentsMadeClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  function updateURL(updates: Partial<CurrentFilters>) {
    const merged = { ...currentFilters, ...updates };
    const params = new URLSearchParams();

    if (merged.page !== 1) params.set("page", String(merged.page));
    if (merged.limit !== 10) params.set("limit", String(merged.limit));
    if (merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy);
    if (merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);
    if (merged.method) params.set("method", merged.method);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleSortFieldChange = (field: PaymentSortField) =>
    updateURL({ sortBy: field, page: 1 });

  const handleSortOrderToggle = () =>
    updateURL({
      sortOrder: currentFilters.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });

  const handleMethodChange = (method: PaymentMethodType | undefined) =>
    updateURL({ method, page: 1 });

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSortOption = sortFieldOptions.find(
    (f) => f.value === currentFilters.sortBy,
  );

  const currentMethodOption = methodOptions.find(
    (m) => m.value === currentFilters.method,
  );

  const hasFilter = !!currentFilters.method;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {meta.total} payment{meta.total !== 1 ? "s" : ""} total
        </p>
        {hasFilter && (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => handleMethodChange(undefined)}
          >
            {currentFilters.method} ✕
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-40 justify-between">
              {currentSortOption?.label ?? "Sort by"}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-36 justify-between",
                hasFilter && "border-blue-300 bg-blue-50/50 text-blue-700",
              )}
            >
              {currentMethodOption?.label ?? "All Methods"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Payment Method</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {methodOptions.map((option) => (
              <DropdownMenuItem
                key={option.value ?? "all"}
                onClick={() => handleMethodChange(option.value)}
                className="cursor-pointer"
              >
                <span className="flex-1">{option.label}</span>
                {currentFilters.method === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          {hasFilter ? (
            <>
              <Search className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                No payments match your filter
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Try removing the method filter to see all payments.
              </p>
            </>
          ) : (
            <>
              <CreditCard className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                No payments made yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Payments you make for tasks will appear here.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <PaymentCard key={payment.id} variant="made" payment={payment} />
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
