import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskPoster } from "@/lib/types";
import { ApplyTaskDialog } from "./ApplyTaskDialog";

interface TaskSidebarCardProps {
  baseCompensation: string;
  postedBy: TaskPoster;
  createdAt: string;
  expiresAt?: string | null;
  taskId: string;
  currentUserId?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TaskSidebarCard({
  baseCompensation,
  postedBy,
  createdAt,
  expiresAt,
  taskId,
  currentUserId,
}: TaskSidebarCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Price Highlight */}
        <div className="text-center py-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl">
          <p className="text-sm text-green-600 mb-1">Earn up to</p>
          <p className="text-4xl font-bold text-green-700">${baseCompensation}</p>
        </div>

        {/* Apply Button */}
        {currentUserId && currentUserId !== postedBy.id && (
          <ApplyTaskDialog taskId={taskId} />
        )}

        <Separator />

        {/* Posted By */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Posted by
          </h4>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={postedBy.image ?? undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {getInitials(postedBy.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{postedBy.name}</p>
              <p className="text-sm text-gray-500">Task Poster</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Task Metadata */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Posted</span>
            <span className="text-gray-900">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Expires</span>
            <span className="text-gray-900">
              {expiresAt
                ? new Date(expiresAt).toLocaleDateString()
                : "No expiry"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Task ID</span>
            <span className="text-gray-900 font-mono text-xs">
              {taskId.slice(0, 8)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
