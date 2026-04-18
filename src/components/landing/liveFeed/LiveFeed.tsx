import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Task } from "@/lib/types";
import LiveFeedTaskCard from "./LiveFeedTaskCard";

async function getRecentlyPostedTasks(): Promise<Task[]> {
  try {
    const res = await apiClient.get<ApiResponse<Task[]>>(
      "/task/recently-posted",
      { revalidate: 60 },
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

const LiveFeed = async () => {
  const tasks = await getRecentlyPostedTasks();

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Recently Posted
            </h2>
            <p className="text-muted-foreground mt-2">
              Real people needing help right now.
            </p>
          </div>
          <Button
            variant="link"
            className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            asChild
          >
            <Link href="/tasks">
              View all tasks <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <LiveFeedTaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            No tasks posted yet.
          </p>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/tasks"
            className="text-blue-600 font-semibold inline-flex items-center"
          >
            View all tasks <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
