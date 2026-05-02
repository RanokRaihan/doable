import { getTaskAction } from "@/actions/task/taskAction";
import { RelatedTasksSection } from "@/components/tasks/detail/RelatedTasksSection";
import { SafetyCard } from "@/components/tasks/detail/SafetyCard";
import { TaskInfoCard } from "@/components/tasks/detail/TaskInfoCard";
import { TaskSidebarCard } from "@/components/tasks/detail/TaskSidebarCard";
import { ImageGallery } from "@/components/tasks/ImageGallery";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [result, user] = await Promise.all([
    getTaskAction(id),
    getCurrentUser(),
  ]);

  if (!result.success || !("data" in result)) {
    if ("statusCode" in result && result.statusCode === 404) {
      notFound();
    }
    throw new Error(
      "message" in result ? result.message : "Failed to load task",
    );
  }

  const task = result.data;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      {/* Navigation bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/tasks">
                <ArrowLeft className="w-4 h-4" />
                Back to tasks
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={task.images} alt={task.title} />
            <TaskInfoCard task={task} />
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <TaskSidebarCard
              baseCompensation={task.baseCompensation}
              postedBy={task.postedBy}
              createdAt={task.createdAt}
              expiresAt={task.expiresAt}
              taskId={task.id}
              currentUserId={user?.id}
              hasApplied={task.hasApplied}
            />
            <SafetyCard />
          </div>
        </div>

        <RelatedTasksSection />
      </div>
    </div>
  );
}
