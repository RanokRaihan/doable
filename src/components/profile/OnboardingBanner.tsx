"use client";

import { useAuth } from "@/providers/AuthProvider";
import { CheckCircle, ChevronRight, Circle } from "lucide-react";
import Link from "next/link";

export default function OnboardingBanner() {
  const { user } = useAuth();

  if (!user) return null;

  const emailVerified = user.emailVerified;
  const profileComplete = user.profileStatus === "COMPLETE";

  // Hide banner once everything is done
  if (emailVerified && profileComplete) return null;

  const steps = [
    {
      label: "Verify your email",
      done: emailVerified,
      href: "/verify-email",
      description: "Check your inbox for the verification link",
    },
    {
      label: "Complete your profile",
      done: profileComplete,
      // Only link to profile step if email is already verified
      href: emailVerified ? "/complete-profile" : undefined,
      description: "Add your personal details to get started",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Finish setting up your account
          </p>
          <p className="text-xs text-blue-600">
            {completedCount} of {steps.length} steps complete
          </p>
        </div>
        <div className="flex gap-1">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${step.done ? "bg-emerald-500" : "bg-blue-200"}`}
            />
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {steps.map((step, i) => (
          <li key={i}>
            {step.href && !step.done ? (
              <Link
                href={step.href}
                className="flex items-center gap-3 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm transition-colors hover:border-blue-300 hover:bg-blue-50/60"
              >
                <Circle className="size-4 shrink-0 text-blue-300" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-800">
                    {step.label}
                  </span>
                  <p className="truncate text-xs text-slate-500">
                    {step.description}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-blue-400" />
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm opacity-70">
                {step.done ? (
                  <CheckCircle className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="size-4 shrink-0 text-slate-300" />
                )}
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-medium ${step.done ? "text-slate-500 " : "text-slate-400"}`}
                  >
                    {step.label}
                  </span>
                  {!step.done && (
                    <p className="truncate text-xs text-slate-400">
                      Complete the previous step first
                    </p>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
