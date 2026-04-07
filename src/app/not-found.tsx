import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:gap-16">
        {/* Left — image */}
        <div className="relative w-full max-w-sm shrink-0 md:w-1/2 md:max-w-none">
          <Image
            src="/not-found-image.jpg"
            alt="Page not found illustration"
            width={560}
            height={560}
            className="h-auto w-full object-contain "
            priority
          />
        </div>

        {/* Right — content */}
        <div className="flex w-full flex-col items-center gap-6 text-center md:w-1/2 md:items-start md:text-left">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-medium"
          >
            Error 404
          </Badge>

          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Page not found
            </h1>
            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              We couldn&apos;t find what you were looking for. Here are a few
              things that might help:
            </p>
          </div>

          <ul className="w-full space-y-2 text-sm text-muted-foreground sm:text-base">
            {[
              "Double-check the URL for typos or extra characters",
              "The page may have been moved or deleted",
              "You might not have permission to view this page",
              "Try navigating from the home page instead",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tasks">Browse Tasks</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
