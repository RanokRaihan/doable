"use client";

import {
  Check,
  ChevronDown,
  Plus,
  SortAsc,
  SortDesc,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { WithdrawalMethodCard } from "@/components/profile/withdrawal/methods/WithdrawalMethodCard";
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
  SortOrder,
  WithdrawalMethod,
  WithdrawalMethodSortField,
  WithdrawalMethodTypeType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface CurrentFilters {
  sortBy: WithdrawalMethodSortField;
  sortOrder: SortOrder;
  methodType?: WithdrawalMethodTypeType;
}

interface WithdrawalMethodsClientProps {
  methods: WithdrawalMethod[];
  currentFilters: CurrentFilters;
}

const methodTypeOptions: {
  value: WithdrawalMethodTypeType | undefined;
  label: string;
}[] = [
  { value: undefined, label: "All Methods" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "MOBILE_BANKING", label: "Mobile Banking" },
];

const sortFieldOptions: { value: WithdrawalMethodSortField; label: string }[] =
  [
    { value: "createdAt", label: "Date Created" },
    { value: "updatedAt", label: "Last Updated" },
  ];

export function WithdrawalMethodsClient({
  methods,
  currentFilters,
}: WithdrawalMethodsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  function updateURL(updates: Partial<CurrentFilters>) {
    const merged = { ...currentFilters, ...updates };
    const params = new URLSearchParams();

    if (merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy);
    if (merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);
    if (merged.methodType) params.set("methodType", merged.methodType);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  }

  const handleMethodTypeChange = (
    methodType: WithdrawalMethodTypeType | undefined,
  ) => updateURL({ methodType });

  const handleSortFieldChange = (field: WithdrawalMethodSortField) =>
    updateURL({ sortBy: field });

  const handleSortOrderToggle = () =>
    updateURL({
      sortOrder: currentFilters.sortOrder === "asc" ? "desc" : "asc",
    });

  const currentTypeOption = methodTypeOptions.find(
    (m) => m.value === currentFilters.methodType,
  );
  const currentSortOption = sortFieldOptions.find(
    (f) => f.value === currentFilters.sortBy,
  );
  const hasFilter = !!currentFilters.methodType;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {methods.length} method{methods.length !== 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/profile/withdrawal/methods/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Method
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-40 justify-between",
                hasFilter && "border-blue-300 bg-blue-50/50 text-blue-700",
              )}
            >
              {currentTypeOption?.label ?? "All Methods"}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Method Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {methodTypeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value ?? "all"}
                onClick={() => handleMethodTypeChange(option.value)}
                className="cursor-pointer"
              >
                <span className="flex-1">{option.label}</span>
                {currentFilters.methodType === option.value && (
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

      {methods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <Wallet className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">
            No withdrawal methods yet
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Add a method to start withdrawing your earnings.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/profile/withdrawal/methods/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Method
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map((method) => (
            <WithdrawalMethodCard key={method.id} method={method} />
          ))}
        </div>
      )}

    </div>
  );
}
