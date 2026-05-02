import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl space-y-6">

        {/* Profile Header Skeleton */}
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <Skeleton className="h-20 w-20 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 w-full">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-px w-full my-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <Card key={i} className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Posted Tasks Skeleton */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-0 pt-5 px-5">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-4 pt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="py-3 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reviews Skeleton */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="pb-0 pt-5 px-5">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="px-5 pb-4 pt-4 space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3 py-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
