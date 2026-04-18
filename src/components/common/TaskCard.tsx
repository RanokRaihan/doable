import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Task, TaskCategoryType, TaskPriorityType } from "@/lib/types";
import { Calendar, ChevronRight, DollarSign, MapPin } from "lucide-react";
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

const categoryConfig: Record<TaskCategoryType, { label: string; className: string }> = {
  DELIVERY:    { label: "Delivery",    className: "bg-blue-100 text-blue-700 border-blue-200" },
  CLEANING:    { label: "Cleaning",    className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  REPAIR:      { label: "Repair",      className: "bg-orange-100 text-orange-700 border-orange-200" },
  TUTORING:    { label: "Tutoring",    className: "bg-purple-100 text-purple-700 border-purple-200" },
  GARDENING:   { label: "Gardening",   className: "bg-green-100 text-green-700 border-green-200" },
  MOVING:      { label: "Moving",      className: "bg-amber-100 text-amber-700 border-amber-200" },
  PET_CARE:    { label: "Pet Care",    className: "bg-pink-100 text-pink-700 border-pink-200" },
  TECH_SUPPORT:{ label: "Tech Support",className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  OTHER:       { label: "Other",       className: "bg-gray-100 text-gray-700 border-gray-200" },
};

const priorityConfig: Record<TaskPriorityType, { label: string; className: string }> = {
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-700 border-red-200" },
  HIGH:   { label: "High",   className: "bg-orange-100 text-orange-700 border-orange-200" },
  MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  LOW:    { label: "Low",    className: "bg-green-100 text-green-700 border-green-200" },
};

const formatDate = (dateString: string): string =>
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

  const catConfig = categoryConfig[task.category];
  const priConfig = priorityConfig[task.priority];

  return (
    <Card className="group flex flex-col h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-0 gap-0">
      {/* Image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={task.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        {/* Category badge overlaid on image bottom-left */}
        {catConfig && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className={`text-xs font-medium border ${catConfig.className}`}>
              {catConfig.label}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 p-4 pb-0">
        {/* Priority + posted date row */}
        <div className="flex items-center justify-between mb-2.5">
          {priConfig && (
            <Badge variant="outline" className={`text-xs font-medium ${priConfig.className}`}>
              {priConfig.label}
            </Badge>
          )}
          <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {formatDate(task.scheduledAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug mb-3">
          <Link href={`/tasks/${task.id}`} className="block">
            {task.title}
          </Link>
        </h3>

        {/* Location */}
        <div className="mt-auto flex items-center text-gray-500">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
          <span className="text-xs line-clamp-1">{task.location}</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between px-4 py-3 mt-3 border-t border-gray-100">
        <span className="flex items-center text-base font-bold text-gray-900">
          <DollarSign className="w-4 h-4 text-primary" />
          {task.baseCompensation}
        </span>
        <Link
          href={`/tasks/${task.id}`}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View details
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
