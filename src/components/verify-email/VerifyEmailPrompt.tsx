"use client";

import { sendVerificationEmailAction } from "@/actions/auth/authAction";
import { Mail, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailPrompt({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setIsSending(true);
    const result = await sendVerificationEmailAction();
    setIsSending(false);

    if (result.success) {
      toast.success("Verification email sent! Check your inbox.");
      setCooldown(RESEND_COOLDOWN);
    } else {
      toast.error(
        "message" in result ? result.message : "Failed to send. Try again.",
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-blue-50">
        <Mail className="size-10 text-blue-500" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Check your inbox
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          We sent a verification link to{" "}
          <span className="font-medium text-slate-700">{email}</span>. Click the
          link to verify your email address.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600">
        <p className="font-medium text-slate-700">Didn&apos;t receive it?</p>
        <ul className="list-disc space-y-1 pl-4">
          <li>Check your spam or junk folder</li>
          <li>Make sure the email address is correct</li>
          <li>Wait a few minutes — it can take some time</li>
        </ul>
      </div>

      <Button
        onClick={handleResend}
        disabled={isSending || cooldown > 0}
        variant="outline"
        className="gap-2"
      >
        <RefreshCw className={`size-4 ${isSending ? "animate-spin" : ""}`} />
        {cooldown > 0
          ? `Resend in ${cooldown}s`
          : isSending
            ? "Sending..."
            : "Resend verification email"}
      </Button>
    </div>
  );
}
