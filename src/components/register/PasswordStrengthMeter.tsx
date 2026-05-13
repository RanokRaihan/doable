import { cn } from "@/lib/utils";

const LABELS = [
  "Use 8+ characters with at least one letter and one number",
  "Weak — too short or missing letter/number",
  "Fair — add a number or letter",
  "Good — meets requirements",
  "Strong — excellent password",
];

function getStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-zA-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length < 8 && score > 0) return 1;
  return score;
}

const segmentColors: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-amber-400",
  3: "bg-ds-orange",
  4: "bg-ds-green",
};

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  const strength = getStrength(password);

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-0.75 flex-1 rounded-full transition-colors duration-200",
              strength >= i && strength > 0
                ? segmentColors[strength]
                : "bg-ds-line",
            )}
          />
        ))}
      </div>
      <p className="text-[11px] text-ds-ink-3">
        {strength > 0 ? (
          <strong className="text-ds-ink-2 font-semibold">
            {LABELS[strength]}
          </strong>
        ) : (
          LABELS[0]
        )}
      </p>
    </div>
  );
}
