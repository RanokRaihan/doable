import { Skeleton } from "@/components/ui/skeleton";

export default function WithdrawalMethodDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <Skeleton className="h-4 w-32" />
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
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
