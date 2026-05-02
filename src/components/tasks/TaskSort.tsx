"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortField, SortOrder } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  SortAsc,
  SortDesc,
  Type,
} from "lucide-react";

interface TaskSortProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const sortFieldOptions: {
  value: SortField;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "createdAt",
    label: "Date Created",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    value: "updatedAt",
    label: "Last Updated",
    icon: <CalendarClock className="h-4 w-4" />,
  },
  { value: "title", label: "Title", icon: <Type className="h-4 w-4" /> },
];

export function TaskSort({
  sortField,
  sortOrder,
  onSortChange,
}: TaskSortProps) {
  const currentFieldOption = sortFieldOptions.find(
    (f) => f.value === sortField,
  );

  return (
    <div className="flex items-center gap-2">
      {/* Sort Field Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-40 justify-between">
            <span className="flex items-center gap-2">
              {currentFieldOption?.icon}
              {currentFieldOption?.label}
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

      {/* Sort Order Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc")
        }
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
