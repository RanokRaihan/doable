"use client";

import { EmailVerificationStatus } from "@/lib/types/auth";
import { useAuth } from "@/providers/AuthProvider";
import { CheckCircle, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const RESEND_COOLDOWN = 60; // seconds, change to 180 later

function getRemainingCooldown(sentAt: string | null): number {
  if (!sentAt) return 0;
  const elapsed = Math.floor((Date.now() - Date.parse(sentAt)) / 1000);
  return Math.max(0, RESEND_COOLDOWN - elapsed);
}

type PromptState = "already-verified" | "sending" | "prompt";

interface Props {
  email: string;
  verificationStatus: EmailVerificationStatus | null;
  sendVerificationEmail: () => Promise<{ success: boolean; message?: string }>;
}

export default function VerifyEmailPrompt({
  email,
  verificationStatus,
  sendVerificationEmail,
}: Props) {
  const { user } = useAuth();
  const [state, setState] = useState<PromptState>(() => {
    if (verificationStatus?.emailVerified) return "already-verified";
    // Auto-send only if email was never sent
    if (!verificationStatus?.emailVerificationSentAt) return "sending";
    // Email was sent before — show prompt with remaining cooldown (or 0)
    return "prompt";
  });

  const [cooldown, setCooldown] = useState(() => {
    if (verificationStatus?.emailVerificationSentAt) {
      return getRemainingCooldown(verificationStatus.emailVerificationSentAt);
    }
    return 0;
  });

  const [isSending, setIsSending] = useState(false);
  const hasSentRef = useRef(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-send when email was never sent
  useEffect(() => {
    if (state !== "sending" || hasSentRef.current) return;
    hasSentRef.current = true;

    sendVerificationEmail().then((result) => {
      if (result.success) {
        setCooldown(RESEND_COOLDOWN);
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(
          "message" in result ? result.message : "Failed to send. Try again.",
        );
      }
      setState("prompt");
    });
  }, [state, sendVerificationEmail]);

  const handleResend = async () => {
    setIsSending(true);
    const result = await sendVerificationEmail();
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

  if (state === "already-verified") {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="size-10 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Your email is already verified
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            <span className="font-medium text-slate-700">{email}</span> has been
            verified. You&apos;re all set!
          </p>
        </div>
        {user?.profileStatus === "INCOMPLETE" ? (
          <Button asChild>
            <Link href="/complete-profile">Complete your profile</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/profile">Continue to profile</Link>
          </Button>
        )}
      </div>
    );
  }

  if (state === "sending") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <Loader2 className="size-12 animate-spin text-blue-500" />
        <p className="text-lg font-medium text-slate-700">
          Sending verification email...
        </p>
      </div>
    );
  }

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
          We sent a verification link to
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
