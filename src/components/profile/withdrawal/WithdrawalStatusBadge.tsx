import { Badge } from "@/components/ui/badge";
import { WithdrawalStatusType } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  WithdrawalStatusType,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  APPROVED: {
    label: "Approved",
    className: "border-blue-300 bg-blue-50 text-blue-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "border-green-300 bg-green-50 text-green-700",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-red-300 bg-red-50 text-red-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-slate-300 bg-slate-50 text-slate-600",
  },
};

interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatusType;
  className?: string;
}

export function WithdrawalStatusBadge({
  status,
  className,
}: WithdrawalStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
