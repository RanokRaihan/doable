import { getMyPostedTaskAction } from "@/actions/task/taskAction";
import { EditTaskForm } from "@/components/profile/tasks/EditTaskForm";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params;
  const result = await getMyPostedTaskAction(id);

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-red-200 bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <h2 className="text-base font-semibold text-red-700">
          {result.statusCode === 404 ? "Task not found" : "Failed to load task"}
        </h2>
        <p className="text-sm text-red-600 mt-1 max-w-xs">
          {result.message ?? "Something went wrong. Please try again."}
        </p>
        <Link href="/profile/tasks">
          <Button variant="outline" className="mt-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to My Tasks
          </Button>
        </Link>
      </div>
    );
  }

  const task = result.data;

  if (task.status !== "OPEN") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
        <Lock className="h-10 w-10 text-slate-300 mb-3" />
        <h2 className="text-base font-semibold text-slate-700">
          Task cannot be edited
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          This task is currently{" "}
          <span className="font-medium">{task.status.replace(/_/g, " ")}</span>{" "}
          and can no longer be modified.
        </p>
        <Link href="/profile/tasks">
          <Button variant="outline" className="mt-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to My Tasks
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/profile/tasks"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold">Edit Task</h1>
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          Update the details for &ldquo;{task.title}&rdquo;
        </p>
      </div>
      <EditTaskForm task={task} />
    </div>
  );
}
