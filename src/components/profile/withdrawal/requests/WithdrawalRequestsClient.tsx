"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Plus,
  SortAsc,
  SortDesc,
  Wallet,
} from "lucide-react";

import { WithdrawalRequestCard } from "@/components/profile/withdrawal/requests/WithdrawalRequestCard";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  PaginationMeta,
  SortOrder,
  WithdrawalMethod,
  WithdrawalRequestSortField,
  WithdrawalRequestWithMethod,
  WithdrawalStatusType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface CurrentFilters {
  page: number;
  limit: number;
  sortBy: WithdrawalRequestSortField;
  sortOrder: SortOrder;
  status?: WithdrawalStatusType;
}

interface WithdrawalRequestsClientProps {
  requests: WithdrawalRequestWithMethod[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
  walletBalance: string;
  methods: WithdrawalMethod[];
}

const statusOptions: { value: WithdrawalStatusType | undefined; label: string }[] =
  [
    { value: undefined, label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

const sortFieldOptions: { value: WithdrawalRequestSortField; label: string }[] =
  [
    { value: "createdAt", label: "Date Created" },
    { value: "updatedAt", label: "Last Updated" },
    { value: "amount", label: "Amount" },
  ];

function formatAmount(amount: string) {
  const num = parseFloat(amount);
  return `৳ ${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function WithdrawalRequestsClient({
  requests,
  meta,
  currentFilters,
  walletBalance,
  methods,
}: WithdrawalRequestsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const hasMethods = methods.length > 0;

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

  const handleStatusChange = (status: WithdrawalStatusType | undefined) =>
    updateURL({ status, page: 1 });

  const handleSortFieldChange = (field: WithdrawalRequestSortField) =>
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

  const currentStatusOption = statusOptions.find(
    (s) => s.value === currentFilters.status,
  );
  const currentSortOption = sortFieldOptions.find(
    (f) => f.value === currentFilters.sortBy,
  );
  const hasFilter = !!currentFilters.status;

  const balance = parseFloat(walletBalance);
  const balanceFormatted = `৳ ${balance.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-5">
      {/* Wallet balance display */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
          <Wallet className="h-4 w-4 text-slate-500 shrink-0" />
          <span className="text-sm text-slate-600">
            Available:{" "}
            <span className="font-semibold text-slate-900">
              {balanceFormatted}
            </span>
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  asChild={hasMethods}
                  size="sm"
                  disabled={!hasMethods}
                  className={cn(!hasMethods && "cursor-not-allowed opacity-60")}
                >
                  {hasMethods ? (
                    <Link href="/profile/withdrawal/requests/new">
                      <Plus className="h-4 w-4 mr-1.5" />
                      New Withdrawal
                    </Link>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1.5" />
                      New Withdrawal
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            {!hasMethods && (
              <TooltipContent>
                <p>Add a withdrawal method first</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {!hasMethods && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">No withdrawal methods</p>
            <p className="text-sm mt-0.5">
              <Link
                href="/profile/withdrawal/methods/new"
                className="underline hover:no-underline"
              >
                Add a method
              </Link>{" "}
              before making a withdrawal request.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-slate-500">
          {meta.total} request{meta.total !== 1 ? "s" : ""} total
        </p>
        {hasFilter && (
          <Badge
            variant="outline"
            className="border-violet-200 bg-violet-50 text-violet-700 cursor-pointer hover:bg-violet-100 transition-colors"
            onClick={() => handleStatusChange(undefined)}
          >
            {currentFilters.status} ✕
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-40 justify-between",
                hasFilter &&
                  "border-violet-300 bg-violet-50/50 text-violet-700",
              )}
            >
              {currentStatusOption?.label ?? "All Statuses"}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value ?? "all"}
                onClick={() => handleStatusChange(option.value)}
                className="cursor-pointer"
              >
                <span className="flex-1">{option.label}</span>
                {currentFilters.status === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-40 justify-between">
              {currentSortOption?.label ?? "Sort by"}
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
            currentFilters.sortOrder === "desc" &&
              "bg-primary/5 border-primary/30",
          )}
          title={
            currentFilters.sortOrder === "asc" ? "Ascending" : "Descending"
          }
        >
          {currentFilters.sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <Wallet className="h-10 w-10 text-slate-300 mb-3" />
          {!hasMethods ? (
            <>
              <h3 className="text-base font-semibold text-slate-700">
                Add a withdrawal method first
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                You need at least one active withdrawal method before making a
                request.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/profile/withdrawal/methods/new">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Method
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-base font-semibold text-slate-700">
                No withdrawal requests yet
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Your withdrawal requests will appear here.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/profile/withdrawal/requests/new">
                  <Plus className="h-4 w-4 mr-1.5" />
                  New Withdrawal
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <WithdrawalRequestCard key={request.id} request={request} />
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
