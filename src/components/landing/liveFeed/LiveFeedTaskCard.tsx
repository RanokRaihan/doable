import {
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Shadcn UI Imports
import { Badge } from "@/components/ui/badge";
import { TaskImage } from "@/lib/types";

// Task type definition
interface Task {
  id: string;
  title: string;
  category?: string;
  priority?: string;
  status: string;
  location: string;
  baseCompensation: string;
  scheduledAt: string;
  createdAt: string;
  images?: TaskImage[];
}

// Category-based placeholder images
const categoryImages: Record<string, string> = {
  REPAIR:
    "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=600&auto=format&fit=crop",
  GARDENING:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop",
  MOVING:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  CLEANING:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
  DEFAULT:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
};

// Format relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

// Format due date
const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LiveFeedTaskCard = ({ task }: { task: Task }) => {
  // Get image - use first task image, or category-based placeholder
  const imageUrl =
    task.images && task.images.length > 0
      ? task.images[0].url
      : categoryImages[task.category || "DEFAULT"] || categoryImages.DEFAULT;

  return (
    <div className="group block h-full">
      <article className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={task.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

          {/* Price Badge - Floating on image */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white backdrop-blur-sm text-primary border-0 shadow-lg px-3 py-1.5 text-sm font-bold hover:bg-white">
              <DollarSign className="w-3.5 h-3.5 mr-0.5" />
              {task.baseCompensation}
            </Badge>
          </div>

          {/* Status Badge - Bottom left of image */}
          <div className="absolute bottom-3 left-3">
            <Badge
              className={`backdrop-blur-sm border-0 shadow-md px-2.5 py-1 text-xs font-medium ${
                task.status === "COMPLETED"
                  ? "bg-gray-800/90 text-gray-100"
                  : task.status === "PAYMENT_PROCESSING"
                    ? "bg-amber-500/90 text-white"
                    : "bg-blue-500/90 text-white"
              }`}
            >
              {task.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col grow p-5">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
            <Link href={`/tasks/${task.id}`} className="block">
              {task.title}
            </Link>
          </h3>

          {/* Meta Info */}
          <div className="space-y-2.5 mt-auto">
            {/* Location */}
            <div className="flex items-start text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-sm line-clamp-1">{task.location}</span>
            </div>

            {/* Due Date */}
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
              <span className="text-sm">
                Due: {formatDueDate(task.scheduledAt)}
              </span>
            </div>
          </div>

          {/* Footer - Posted time */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-400">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">
                Posted {getRelativeTime(task.createdAt)}
              </span>
            </div>

            {/* View Arrow */}
            <Link
              href={`/tasks/${task.id}`}
              className="text-blue-600 text-sm font-medium  flex items-center"
            >
              View
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default LiveFeedTaskCard;
