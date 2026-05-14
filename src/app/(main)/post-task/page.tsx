import type { Metadata } from "next";
import PostTaskForm from "@/components/post-task/PostTaskForm";
import { ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Post a Task",
  description:
    "Describe your task, set your budget, and connect with skilled local helpers in minutes.",
  robots: { index: false },
};

export default function PostTaskPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-20">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-11 items-center justify-center rounded-xl">
            <ClipboardList className="text-primary size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Post a Task</h1>
            <p className="text-muted-foreground text-sm">
              Describe what you need done and find the right person for the job.
            </p>
          </div>
        </div>
      </div>

      <PostTaskForm />
    </main>
  );
}
