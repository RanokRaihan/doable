"use client";

import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, TaskStatusType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ApproveCompletionDialog } from "./ApproveCompletionDialog";
import { RequestRevisionDialog } from "./RequestRevisionDialog";

const statusConfig: Record<
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
    className: "bg-sky-100 text-sky-700 border-sky-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PENDING_REVIEW: {
    label: "Pending Review",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  PAYMENT_PROCESSING: {
    label: "Payment Processing",
    className: "bg-purple-100 text-purple-700 border-purple-200",
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
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-teal-100 text-teal-700 border-teal-200",
  },
};

const categoryPlaceholders: Record<string, string> = {
  REPAIR:
    "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=200&auto=format&fit=crop",
  GARDENING:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop",
  MOVING:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop",
  CLEANING:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop",
  DEFAULT:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=200&auto=format&fit=crop",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatCategory = (cat: string) =>
  cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface MyTaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MyTaskCard({ task, onEdit, onDelete }: MyTaskCardProps) {
  const router = useRouter();
  const [approveOpen, setApproveOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);

  const imageUrl =
    task.images && task.images.length > 0
      ? task.images[0].url
      : (categoryPlaceholders[task.category] ?? categoryPlaceholders.DEFAULT);

  const status = statusConfig[task.status];

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200">
        {/* Thumbnail */}
        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
          <Image
            src={imageUrl}
            alt={task.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/tasks/${task.id}`}
            className="font-semibold text-sm text-indigo-600 truncate leading-tight hover:underline"
          >
            {task.title}
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            <span className="text-xs text-slate-500 font-medium">
              {formatCategory(task.category)}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-48">{task.location}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDate(task.scheduledAt)}
            </span>
          </div>
        </div>

        {/* Right side: status + price + menu */}
        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium hidden sm:inline-flex",
              status.className,
            )}
          >
            {status.label}
          </Badge>

          <span className="text-sm font-bold text-slate-800">
            ${task.baseCompensation}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Task actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/tasks/${task.id}/applications`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ClipboardList className="h-4 w-4" />
                  Applications
                </Link>
              </DropdownMenuItem>
              {task.status === "PAYMENT_PROCESSING" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/profile/tasks/${task.id}/payment`}
                      className="flex items-center gap-2 cursor-pointer text-purple-600 focus:text-purple-600 focus:bg-purple-50"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Now
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {task.status === "PENDING_REVIEW" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setApproveOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Completion
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRevisionOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Request Revision
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={() => onEdit(task.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {task.status === "PENDING_REVIEW" && (
        <>
          <ApproveCompletionDialog
            taskId={task.id}
            taskTitle={task.title}
            open={approveOpen}
            onOpenChange={setApproveOpen}
            onSuccess={() => router.refresh()}
          />
          <RequestRevisionDialog
            taskId={task.id}
            taskTitle={task.title}
            open={revisionOpen}
            onOpenChange={setRevisionOpen}
            onSuccess={() => router.refresh()}
          />
        </>
      )}
    </>
  );
}
