import { Calendar, Clock, DollarSign, Timer } from "lucide-react";

interface TaskMetaGridProps {
  baseCompensation: string;
  estimatedDuration?: number;
  scheduledAt: string;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TaskMetaGrid({
  baseCompensation,
  estimatedDuration,
  scheduledAt,
}: TaskMetaGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-green-700">${baseCompensation}</p>
        <p className="text-xs text-green-600 mt-0.5">Compensation</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <Timer className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <p className="text-lg font-bold text-blue-700">
          {estimatedDuration ? formatDuration(estimatedDuration) : "Flexible"}
        </p>
        <p className="text-xs text-blue-600 mt-0.5">Est. Duration</p>
      </div>

      <div className="bg-purple-50 rounded-xl p-4 text-center">
        <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-purple-700">
          {new Date(scheduledAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-xs text-purple-600 mt-0.5">Scheduled</p>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 text-center">
        <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-amber-700">
          {formatTime(scheduledAt)}
        </p>
        <p className="text-xs text-amber-600 mt-0.5">Start Time</p>
      </div>
    </div>
  );
}
