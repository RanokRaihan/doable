import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskDetails } from "@/lib/types";
import { MapPin } from "lucide-react";
import { TaskBadges } from "./TaskBadges";
import { TaskMetaGrid } from "./TaskMetaGrid";

interface TaskInfoCardProps {
  task: TaskDetails;
}

export function TaskInfoCard({ task }: TaskInfoCardProps) {
  return (
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

        {/* Location */}
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
              <p className="text-sm text-gray-500 mt-1">
                Exact address shared after application approval
              </p>
              <Badge variant="outline" className="text-xs mt-2 text-gray-400 border-gray-200">
                Approximate location
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
