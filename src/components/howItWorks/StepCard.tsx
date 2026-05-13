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
    badge: "bg-ds-orange text-white",
    iconWrapper: "bg-ds-orange-soft text-ds-orange-ink",
    number: "bg-ds-orange",
  },
  green: {
    badge: "bg-ds-orange text-white",
    iconWrapper: "bg-ds-orange-soft text-ds-orange-ink",
    number: "bg-ds-orange",
  },
  purple: {
    badge: "bg-ds-orange text-white",
    iconWrapper: "bg-ds-orange-soft text-ds-orange-ink",
    number: "bg-ds-orange",
  },
  orange: {
    badge: "bg-ds-orange text-white",
    iconWrapper: "bg-ds-orange-soft text-ds-orange-ink",
    number: "bg-ds-orange",
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
        "group relative flex gap-5 rounded-2xl border border-ds-line bg-white p-6",
        "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -top-3.5 -left-3.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
          config.number,
        )}
      >
        {stepNumber}
      </div>

      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          config.iconWrapper,
        )}
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>

      <div className="min-w-0">
        <h3 className="mb-1.5 text-[15px] font-semibold text-ds-ink">{title}</h3>
        <p className="text-[13px] leading-relaxed text-ds-ink-3">{description}</p>
      </div>
    </div>
  );
};
