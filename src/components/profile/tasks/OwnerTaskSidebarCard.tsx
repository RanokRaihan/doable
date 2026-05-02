import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MyPostedTask } from "@/lib/types";
import { Calendar, ClipboardList, CreditCard, DollarSign, Edit, Hash } from "lucide-react";
import Link from "next/link";
import { OwnerPendingReviewActions } from "./OwnerPendingReviewActions";

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: {
    label: "Open",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  PAYMENT_INITIATED: {
    label: "Payment Initiated",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  PENDING_REVIEW: {
    label: "Pending Review",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
};

interface OwnerTaskSidebarCardProps {
  task: MyPostedTask;
}

export function OwnerTaskSidebarCard({ task }: OwnerTaskSidebarCardProps) {
  const statusCfg = statusConfig[task.status] ?? {
    label: task.status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };
  // const applicationCount = task.applications.length;
  const isEditable = task.status === "OPEN";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-5">
        {/* Compensation */}
        <div className="text-center py-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-600 font-medium">
              Base Compensation
            </p>
          </div>
          <p className="text-4xl font-bold text-green-700">
            ${task.baseCompensation}
          </p>
          {task.agreedCompensation && (
            <p className="text-sm text-green-600 mt-1">
              Agreed:{" "}
              <span className="font-semibold">${task.agreedCompensation}</span>
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Status</span>
          <Badge className={`border ${statusCfg.className}`}>
            {statusCfg.label}
          </Badge>
        </div>

        {/* Pending review actions */}
        {task.status === "PENDING_REVIEW" && (
          <>
            <Separator />
            <OwnerPendingReviewActions
              taskId={task.id}
              taskTitle={task.title}
              stacked
            />
          </>
        )}

        {/* Applications */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Users className="w-4 h-4" />
            Applications
          </div>
          <Badge
            variant={applicationCount > 0 ? "default" : "secondary"}
            className={applicationCount > 0 ? "bg-blue-600" : ""}
          >
            {applicationCount === 0
              ? "No applications"
              : `${applicationCount} applicant${applicationCount !== 1 ? "s" : ""}`}
          </Badge>
        </div> */}

        <Separator />

        {/* Actions */}
        <div className="space-y-2.5">
          {task.status === "PAYMENT_PENDING" && (
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href={`/profile/tasks/${task.id}/payment`}>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Link>
            </Button>
          )}
          {isEditable && (
            <Button asChild className="w-full" variant="default">
              <Link href={`/profile/tasks/edit/${task.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/profile/tasks">
              <ClipboardList className="w-4 h-4 mr-2" />
              All My Tasks
            </Link>
          </Button>
        </div>

        <Separator />

        {/* Metadata */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              Posted
            </div>
            <span className="text-gray-900 font-medium">
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              Expires
            </div>
            <span className="text-gray-900 font-medium">
              {task.expiresAt
                ? new Date(task.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No expiry"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              Last updated
            </div>
            <span className="text-gray-900 font-medium">
              {new Date(task.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Hash className="w-3.5 h-3.5" />
              Task ID
            </div>
            <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
              {task.id.slice(0, 10)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
