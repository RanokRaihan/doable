import { TaskStatusType } from "@/lib/types";

export const taskStatusConfig: Record<
  TaskStatusType,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  OPEN: {
    label: "Open",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  ASSIGNED: {
    label: "Assigned",
    className: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  PENDING_REVIEW: {
    label: "Pending Review",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PAYMENT_PROCESSING: {
    label: "Payment Processing",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  DISPUTED: {
    label: "Disputed",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-teal-100 text-teal-700 border-teal-200",
  },
};
