import { Badge } from "@/components/ui/badge";
import { Task, TaskCategoryType, TaskPriorityType } from "@/lib/types";
import { Calendar, DollarSign, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categoryImages: Record<string, string> = {
  DELIVERY:
    "https://images.unsplash.com/photo-1568765631485-8f38a474bba3?q=80&w=600&auto=format&fit=crop",
  CLEANING:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
  REPAIR:
    "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=600&auto=format&fit=crop",
  TUTORING:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
  GARDENING:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop",
  MOVING:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  PET_CARE:
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop",
  TECH_SUPPORT:
    "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?q=80&w=600&auto=format&fit=crop",
  OTHER:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
};

const categoryConfig: Record<
  TaskCategoryType,
  { label: string; color: string }
> = {
  DELIVERY: { label: "Delivery", color: "bg-blue-500" },
  CLEANING: { label: "Cleaning", color: "bg-cyan-500" },
  REPAIR: { label: "Repair", color: "bg-orange-500" },
  TUTORING: { label: "Tutoring", color: "bg-purple-500" },
  GARDENING: { label: "Gardening", color: "bg-green-500" },
  MOVING: { label: "Moving", color: "bg-amber-500" },
  PET_CARE: { label: "Pet Care", color: "bg-pink-500" },
  TECH_SUPPORT: { label: "Tech Support", color: "bg-indigo-500" },
  OTHER: { label: "Other", color: "bg-gray-500" },
};

const priorityConfig: Record<
  TaskPriorityType,
  { label: string; className: string }
> = {
  URGENT: {
    label: "Urgent",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  LOW: {
    label: "Low",
    className: "bg-green-100 text-green-700 border-green-200",
  },
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TaskCard = ({ task }: { task: Task }) => {
  const imageUrl =
    task.images && task.images.length > 0
      ? task.images[0].url
      : (categoryImages[task.category] ?? categoryImages.OTHER);

  const cat = categoryConfig[task.category];
  const pri = priorityConfig[task.priority];

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
      {/* Image */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={task.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        {cat && (
          <span
            className={`absolute top-3 left-3 ${cat.color} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm`}
          >
            {cat.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Priority */}
        {pri && (
          <Badge
            variant="outline"
            className={`self-start text-xs font-medium ${pri.className}`}
          >
            {pri.label}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {task.title}
        </h3>

        {/* Meta */}
        <div className="mt-auto pt-2 flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{task.location}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {formatDate(task.scheduledAt)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <span className="flex items-center gap-0.5 text-base font-bold text-gray-900">
          <DollarSign className="w-4 h-4 text-primary" />
          {task.baseCompensation}
        </span>
        <Link
          href={`/tasks/${task.id}`}
          className="text-xs font-semibold text-blue-600 group-hover:underline underline-offset-2"
        >
          View details →
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
