import { Badge } from "@/components/ui/badge";
import { TaskCategoryType, TaskPriorityType, TaskStatusType } from "@/lib/types";
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

const statusConfig: Record<TaskStatusType, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-700" },
  PAYMENT_PROCESSING: {
    label: "Payment Processing",
    className: "bg-purple-100 text-purple-700",
  },
};

interface TaskBadgesProps {
  status: TaskStatusType;
  priority: TaskPriorityType;
  category: TaskCategoryType;
}

export function TaskBadges({ status, priority, category }: TaskBadgesProps) {
  const priorityCfg = priorityConfig[priority];
  const statusCfg = statusConfig[status];
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
