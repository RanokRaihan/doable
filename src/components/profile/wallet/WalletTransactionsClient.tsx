"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Search,
  SortAsc,
  SortDesc,
  Wallet,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { TaskPagination } from "@/components/tasks/TaskPagination";
import { WalletTransactionCard } from "@/components/profile/wallet/WalletTransactionCard";
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
  PaginationMeta,
  SortOrder,
  WalletTransaction,
  WalletTransactionSortField,
  WalletTransactionTypeType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface CurrentFilters {
  page: number;
  limit: number;
  type?: WalletTransactionTypeType;
  sortBy: WalletTransactionSortField;
  sortOrder: SortOrder;
}

interface WalletTransactionsClientProps {
  transactions: WalletTransaction[];
  meta: PaginationMeta;
  currentFilters: CurrentFilters;
}

const sortFieldOptions: { value: WalletTransactionSortField; label: string }[] = [
  { value: "createdAt", label: "Date" },
  { value: "amount",    label: "Amount" },
];

const typeOptions: {
  value: WalletTransactionTypeType | undefined;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: undefined,  label: "All Types",     icon: <Wallet className="h-4 w-4" /> },
  { value: "CREDIT",   label: "Credits Only",  icon: <ArrowUpRight className="h-4 w-4 text-green-600" /> },
  { value: "DEBIT",    label: "Debits Only",   icon: <ArrowDownLeft className="h-4 w-4 text-red-600" /> },
];

export function WalletTransactionsClient({
  transactions,
  meta,
  currentFilters,
}: WalletTransactionsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  function updateURL(updates: Partial<CurrentFilters>) {
    const merged = { ...currentFilters, ...updates };
    const params = new URLSearchParams();

    if (merged.page !== 1)           params.set("page",      String(merged.page));
    if (merged.limit !== 10)         params.set("limit",     String(merged.limit));
    if (merged.type)                 params.set("type",      merged.type);
    if (merged.sortBy !== "createdAt") params.set("sortBy",  merged.sortBy);
    if (merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleTypeChange = (type: WalletTransactionTypeType | undefined) =>
    updateURL({ type, page: 1 });

  const handleSortFieldChange = (sortBy: WalletTransactionSortField) =>
    updateURL({ sortBy, page: 1 });

  const handleSortOrderToggle = () =>
    updateURL({
      sortOrder: currentFilters.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentTypeOption = typeOptions.find((o) => o.value === currentFilters.type);
  const currentSortOption = sortFieldOptions.find((o) => o.value === currentFilters.sortBy);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Transactions</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {meta.total} transaction{meta.total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-36 justify-between">
              {currentTypeOption?.label ?? "All Types"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {typeOptions.map((option) => (
              <DropdownMenuItem
                key={String(option.value)}
                onClick={() => handleTypeChange(option.value)}
                className="cursor-pointer"
              >
                <span className="mr-2">{option.icon}</span>
                <span className="flex-1">{option.label}</span>
                {currentFilters.type === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-36 justify-between">
              {currentSortOption?.label ?? "Sort by"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
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

        {currentFilters.type && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTypeChange(undefined)}
            className="text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {currentFilters.type && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 pr-1">
            {currentFilters.type === "CREDIT" ? "Credits" : "Debits"}
            <button
              onClick={() => handleTypeChange(undefined)}
              className="ml-1 rounded-full hover:bg-slate-200 p-0.5 transition-colors"
              aria-label="Clear filter"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          {currentFilters.type ? (
            <>
              <Search className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                No {currentFilters.type.toLowerCase()} transactions found
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => handleTypeChange(undefined)}
              >
                Clear filter
              </Button>
            </>
          ) : (
            <>
              <Wallet className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No transactions yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Transactions will appear here after task completions or payments.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <WalletTransactionCard key={tx.id} transaction={tx} />
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
