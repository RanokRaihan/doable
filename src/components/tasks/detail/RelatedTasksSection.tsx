import TaskCard from "@/components/common/TaskCard";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import Link from "next/link";

const RELATED_TASKS: Task[] = [
  {
    id: "task1",
    title: "Help Moving Boxes to Storage Unit",
    category: "MOVING",
    priority: "MEDIUM",
    status: "OPEN",
    location: "Philadelphia, PA",
    baseCompensation: "80",
    scheduledAt: "2026-02-15T09:00:00.000Z",
    createdAt: "2026-02-08T10:00:00.000Z",
    updatedAt: "2026-02-08T10:00:00.000Z",
    images: [],
  },
  {
    id: "task2",
    title: "Furniture Disassembly for Move",
    category: "MOVING",
    priority: "HIGH",
    status: "OPEN",
    location: "King of Prussia, PA",
    baseCompensation: "100",
    scheduledAt: "2026-02-12T14:00:00.000Z",
    createdAt: "2026-02-07T15:30:00.000Z",
    updatedAt: "2026-02-07T15:30:00.000Z",
    images: [],
  },
  {
    id: "task3",
    title: "Office Desk Assembly",
    category: "REPAIR",
    priority: "LOW",
    status: "OPEN",
    location: "Wayne, PA",
    baseCompensation: "45",
    scheduledAt: "2026-02-18T11:00:00.000Z",
    createdAt: "2026-02-06T08:00:00.000Z",
    updatedAt: "2026-02-06T08:00:00.000Z",
    images: [],
  },
];

export function RelatedTasksSection() {
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
        {RELATED_TASKS.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
