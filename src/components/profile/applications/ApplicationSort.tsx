"use client";

import {
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  CircleDot,
  DollarSign,
  SortAsc,
  SortDesc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApplicationSortField, SortOrder } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ApplicationSortProps {
  sortField: ApplicationSortField;
  sortOrder: SortOrder;
  onSortChange: (field: ApplicationSortField, order: SortOrder) => void;
}

const sortFieldOptions: {
  value: ApplicationSortField;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "createdAt",           label: "Date Applied",  icon: <Calendar className="h-4 w-4" />     },
  { value: "updatedAt",           label: "Last Updated",  icon: <CalendarClock className="h-4 w-4" /> },
  { value: "proposedCompensation",label: "Compensation",  icon: <DollarSign className="h-4 w-4" />   },
  { value: "status",              label: "Status",        icon: <CircleDot className="h-4 w-4" />    },
];

export function ApplicationSort({ sortField, sortOrder, onSortChange }: ApplicationSortProps) {
  const currentOption = sortFieldOptions.find((f) => f.value === sortField);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-40 justify-between">
            <span className="flex items-center gap-2">
              {currentOption?.icon}
              {currentOption?.label}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-45">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortFieldOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value, sortOrder)}
              className="cursor-pointer"
            >
              <span className="flex items-center gap-2 flex-1">
                {option.icon}
                {option.label}
              </span>
              {sortField === option.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc")}
        className={cn(
          "shrink-0",
          sortOrder === "desc" && "bg-primary/5 border-primary/30",
        )}
        title={sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        {sortOrder === "asc" ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
