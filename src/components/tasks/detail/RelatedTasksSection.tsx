import TaskCard from "@/components/common/TaskCard";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import Link from "next/link";

interface RelatedTasksSectionProps {
  tasks: Task[];
}

export function RelatedTasksSection({ tasks }: RelatedTasksSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Other tasks you might be interested in
        </h2>
        <Button variant="ghost" asChild className="text-blue-600">
          <Link href="/tasks">View all</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
