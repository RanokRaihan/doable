import type { Metadata } from "next";
import { getMyPostedTaskAction } from "@/actions/task/taskAction";

export const metadata: Metadata = {
  title: "Task Details",
  description: "View and manage your posted task.",
};
import { OwnerTaskSidebarCard } from "@/components/profile/tasks/OwnerTaskSidebarCard";
import { TaskBadges } from "@/components/tasks/detail/TaskBadges";
import { TaskMetaGrid } from "@/components/tasks/detail/TaskMetaGrid";
import { ImageGallery } from "@/components/tasks/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function OwnerTaskDetailPage({ params }: Props) {
  const { taskId } = await params;
  const result = await getMyPostedTaskAction(taskId);

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
  const applicationCount = task.applications.length;

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
          <Link href="/profile/tasks">
            <ArrowLeft className="w-4 h-4" />
            My Tasks
          </Link>
        </Button>
        {task.status === "OPEN" && (
          <Button size="sm" asChild>
            <Link href={`/profile/tasks/edit/${task.id}`}>
              <Edit className="w-4 h-4 mr-1.5" />
              Edit Task
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main content (left 2/3) ─────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={task.images} alt={task.title} />

          {/* Owner info card */}
          <Card>
            <CardHeader className="pb-4">
              <TaskBadges
                status={task.status}
                priority={task.priority}
                category={task.category}
              />
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                {task.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <TaskMetaGrid
                baseCompensation={task.baseCompensation}
                estimatedDuration={task.estimatedDuration}
                scheduledAt={task.scheduledAt}
              />

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {task.description ?? "No description provided."}
                </p>
              </div>

              <Separator />

              {/* Location — full address shown to owner */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Location
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{task.location}</p>
                    {task.latitude && task.longitude && (
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {task.latitude.toFixed(6)}, {task.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Applications section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Applications
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={applicationCount > 0 ? "default" : "secondary"}
                      className={applicationCount > 0 ? "bg-blue-600" : ""}
                    >
                      {applicationCount === 0
                        ? "No applications yet"
                        : `${applicationCount} applicant${applicationCount !== 1 ? "s" : ""}`}
                    </Badge>
                    {applicationCount > 0 && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/profile/tasks/${taskId}/applications`}>
                          View All
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {applicationCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
                    <Users className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">
                      No one has applied yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applications will appear here once workers start applying.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {task.applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                            {app.applicantId.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-mono text-gray-500">
                            {app.applicantId.slice(0, 10)}…
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {app.status.toLowerCase().replace(/_/g, " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar (right 1/3) ─────────────────────── */}
        <div className="lg:sticky lg:top-6 self-start space-y-4">
          <OwnerTaskSidebarCard task={task} />
        </div>
      </div>
    </div>
  );
}
