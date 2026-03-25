import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: "blue" | "green" | "purple" | "orange";
  className?: string;
}

const accentConfig = {
  blue: {
    badge: "bg-blue-600 text-white",
    iconWrapper: "bg-blue-50 text-blue-600",
    glow: "shadow-blue-500/15",
    hover: "hover:shadow-blue-500/25",
    border: "hover:border-blue-200",
    number: "bg-blue-600",
    line: "bg-blue-100",
  },
  green: {
    badge: "bg-emerald-600 text-white",
    iconWrapper: "bg-emerald-50 text-emerald-600",
    glow: "shadow-emerald-500/15",
    hover: "hover:shadow-emerald-500/25",
    border: "hover:border-emerald-200",
    number: "bg-emerald-600",
    line: "bg-emerald-100",
  },
  purple: {
    badge: "bg-purple-600 text-white",
    iconWrapper: "bg-purple-50 text-purple-600",
    glow: "shadow-purple-500/15",
    hover: "hover:shadow-purple-500/25",
    border: "hover:border-purple-200",
    number: "bg-purple-600",
    line: "bg-purple-100",
  },
  orange: {
    badge: "bg-orange-500 text-white",
    iconWrapper: "bg-orange-50 text-orange-500",
    glow: "shadow-orange-500/15",
    hover: "hover:shadow-orange-500/25",
    border: "hover:border-orange-200",
    number: "bg-orange-500",
    line: "bg-orange-100",
  },
};

export const StepCard = ({
  stepNumber,
  icon: Icon,
  title,
  description,
  accentColor,
  className,
}: StepCardProps) => {
  const config = accentConfig[accentColor];

  return (
    <div
      className={cn(
        "group relative flex gap-5 rounded-2xl border border-gray-100 bg-white p-6",
        "shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        config.glow,
        config.hover,
        config.border,
        className,
      )}
    >
      {/* Step number badge */}
      <div
        className={cn(
          "absolute -top-3.5 -left-3.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md",
          config.number,
        )}
      >
        {stepNumber}
      </div>

      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          config.iconWrapper,
        )}
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <h3 className="mb-1.5 font-bold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      </div>
    </div>
  );
};
