import { Skeleton } from "@/components/ui/skeleton";

export default function WithdrawalRequestDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-36" />

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <Skeleton className="h-4 w-36" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  );
}
