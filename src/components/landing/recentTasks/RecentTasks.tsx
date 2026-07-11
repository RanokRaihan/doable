import TaskCard from "@/components/common/TaskCard";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Task } from "@/lib/types";
import Link from "next/link";

async function getRecentTasks(): Promise<Task[]> {
  try {
    const res = await apiClient.get<ApiResponse<Task[]>>(
      "/task/recently-posted",
      { revalidate: 60 },
    );
    return (res.data ?? []).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function RecentTasks() {
  const tasks = await getRecentTasks();
  console.log("RecentTasks tasks:", tasks);
  return (
    <section className="pt-8 pb-24 bg-ds-bg" id="tasks">
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        {/* Header */}
        <div className="flex justify-between items-end gap-8 flex-wrap mb-12">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ds-ink-3 mb-3.5">
              Recently posted
            </div>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-tight text-ds-ink m-0"
              style={
                {
                  fontSize: "clamp(34px, 4vw, 52px)",
                  textWrap: "balance",
                } as React.CSSProperties
              }
            >
              Tasks looking for a hand{" "}
              <em className="italic text-ds-orange ">right now</em>.
            </h2>
          </div>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 h-9.5 px-4 rounded-full text-[14px] font-medium border border-ds-line-2 text-ds-ink bg-transparent hover:bg-ds-bg-2 transition-all hover:-translate-y-px no-underline whitespace-nowrap"
          >
            Browse all tasks →
          </Link>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-ds-ink-3 text-[15px]">
              No tasks posted yet — check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
