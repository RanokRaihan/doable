import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-xl border-border/60">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs"
            >
              Error 404
            </Badge>
          </div>
          <CardTitle className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            This page could not be found
          </CardTitle>
          <p className="text-pretty text-sm text-muted-foreground sm:text-base">
            The link may be broken, outdated, or the page may have been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tasks">Browse Tasks</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
