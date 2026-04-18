import { Skeleton } from "@/components/ui/skeleton";

export function FiltersBarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search row */}
      <Skeleton className="h-10 w-full lg:max-w-md" />
      {/* Filters + sort row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}
