import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-100"
          >
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-4 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
