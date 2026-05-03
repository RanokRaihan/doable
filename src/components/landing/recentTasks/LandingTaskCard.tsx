import Link from "next/link";
import Image from "next/image";
import type { Task, TaskCategoryType } from "@/lib/types";

const categoryConfig: Record<
  TaskCategoryType,
  { label: string; thumb: string; gradient: string }
> = {
  DELIVERY: { label: "Delivery", thumb: "t-delivery", gradient: "linear-gradient(135deg, #ffe4d0, #fed7aa)" },
  CLEANING: { label: "Cleaning", thumb: "t-cleaning", gradient: "linear-gradient(135deg, #d0f4ff, #bae6fd)" },
  REPAIR: { label: "Repair", thumb: "t-repair", gradient: "linear-gradient(135deg, #fde9b0, #fde68a)" },
  TUTORING: { label: "Tutoring", thumb: "t-tutoring", gradient: "linear-gradient(135deg, #dde4ff, #c7d2fe)" },
  GARDENING: { label: "Gardening", thumb: "t-gardening", gradient: "linear-gradient(135deg, #d7f4e2, #bbf7d0)" },
  MOVING: { label: "Moving", thumb: "t-moving", gradient: "linear-gradient(135deg, #ffe4d0, #fed7aa)" },
  PET_CARE: { label: "Pet care", thumb: "t-pet", gradient: "linear-gradient(135deg, #d7f4e2, #bbf7d0)" },
  TECH_SUPPORT: { label: "Tech support", thumb: "t-tech", gradient: "linear-gradient(135deg, #fde9b0, #fde68a)" },
  OTHER: { label: "Other", thumb: "t-other", gradient: "linear-gradient(135deg, #f1f5f9, #e2e8f0)" },
};

function relativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function LandingTaskCard({ task }: { task: Task }) {
  const cat = categoryConfig[task.category] ?? categoryConfig.OTHER;
  const imageUrl = task.images && task.images.length > 0 ? task.images[0].url : null;
  const locationShort = task.location?.split(",")[0] ?? "Nearby";

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="bg-white border border-ds-line rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-150 hover:-translate-y-0.5 group no-underline"
      style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.04)" }}
    >
      {/* Thumbnail */}
      <div
        className="relative rounded-xl mb-4 overflow-hidden border border-ds-line"
        style={{ aspectRatio: "16 / 10", marginTop: -4 }}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={task.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: cat.gradient }} />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "repeating-linear-gradient(135deg, rgba(15,23,42,0.04) 0 1px, transparent 1px 12px)",
              }}
            />
          </>
        )}
        <span
          className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.04em]"
          style={{ background: "rgba(255,255,255,0.92)", color: "#475569", fontFamily: "ui-monospace, monospace" }}
        >
          {cat.label.toLowerCase()}
        </span>
      </div>

      {/* Head row */}
      <div className="flex justify-between items-start mb-3.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-ds-ink-3">
          <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
          {cat.label}
        </span>
        <span className="text-[18px] font-semibold text-ds-ink tracking-tight leading-none">
          ${task.baseCompensation}
          <span className="text-[12px] font-medium text-ds-ink-3 ml-0.5">/task</span>
        </span>
      </div>

      {/* Title */}
      <h4 className="text-[16px] font-semibold text-ds-ink leading-snug tracking-tight m-0 mb-2 line-clamp-2 group-hover:text-ds-orange transition-colors">
        {task.title}
      </h4>

      {/* Description */}
      <p className="text-[14px] text-ds-ink-2 m-0 mb-4.5 leading-snug flex-1 line-clamp-2">
        {task.description}
      </p>

      {/* Meta */}
      <div className="flex justify-between items-center pt-3.5 border-t border-ds-line text-[12px] font-medium text-ds-ink-3">
        <span className="flex items-center gap-2 text-ds-ink-2">
          <span
            className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
            style={{ background: "linear-gradient(135deg, #fed7aa, #f97316)" }}
          >
            •
          </span>
          {locationShort}
        </span>
        <span>Posted {relativeTime(task.createdAt)}</span>
      </div>
    </Link>
  );
}
