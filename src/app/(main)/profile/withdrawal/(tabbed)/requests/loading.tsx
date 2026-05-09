import { Skeleton } from "@/components/ui/skeleton";

export default function WithdrawalRequestsLoading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
