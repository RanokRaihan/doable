import { Badge } from "@/components/ui/badge";
import { taskStatusConfig } from "@/lib/taskStatusConfig";
import {
  TaskCategoryType,
  TaskPriorityType,
  TaskStatusType,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowUp } from "lucide-react";

const priorityConfig: Record<
  TaskPriorityType,
  { label: string; className: string; icon: React.ElementType | null }
> = {
  URGENT: {
    label: "Urgent",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  HIGH: {
    label: "High",
    className: "bg-orange-100 text-orange-700 border-orange-200",
    icon: ArrowUp,
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: null,
  },
  LOW: {
    label: "Low",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: null,
  },
};

interface TaskBadgesProps {
  status: TaskStatusType;
  priority: TaskPriorityType;
  category: TaskCategoryType;
}

export function TaskBadges({ status, priority, category }: TaskBadgesProps) {
  const priorityCfg = priorityConfig[priority];
  const statusCfg = taskStatusConfig[status];
  const PriorityIcon = priorityCfg.icon;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge className={cn("border", statusCfg.className)}>
        {statusCfg.label}
      </Badge>
      <Badge variant="outline" className={cn("border", priorityCfg.className)}>
        {PriorityIcon && <PriorityIcon className="w-3 h-3 mr-1" />}
        {priorityCfg.label} Priority
      </Badge>
      <Badge variant="secondary">{category.replace(/_/g, " ")}</Badge>
    </div>
  );
}
