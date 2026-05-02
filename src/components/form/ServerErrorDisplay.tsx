import { X } from "lucide-react";

interface ServerErrorDisplayProps {
  serverError: string;
  setServerError: (error: string | null) => void;
}
const ServerErrorDisplay = ({
  serverError,
  setServerError,
}: ServerErrorDisplayProps) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{serverError}</span>
      <button
        type="button"
        onClick={() => setServerError(null)}
        className="shrink-0 rounded p-0.5 hover:bg-red-100"
        aria-label="Dismiss error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ServerErrorDisplay;
