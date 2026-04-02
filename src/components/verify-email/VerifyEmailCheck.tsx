"use client";

import { verifyEmailAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailCheck({
  token,
  callbackUrl,
}: {
  token: string;
  callbackUrl?: string;
}) {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { refreshUser } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    verifyEmailAction({ token }).then((result) => {
      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Email verified successfully!");
        refreshUser();
        // Give user a moment to see the success state, then redirect
        setTimeout(() => {
          router.push(callbackUrl || "/profile");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(
          "message" in result
            ? result.message
            : "Verification failed. The link may be invalid or expired.",
        );
      }
    });
  }, [token, callbackUrl, router, refreshUser]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      {status === "verifying" && (
        <>
          <Loader2 className="size-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium text-slate-700">
            Verifying your email...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="size-12 text-emerald-500" />
          <p className="text-lg font-medium text-slate-800">{message}</p>
          <p className="text-sm text-slate-500">Redirecting you now...</p>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="size-12 text-red-500" />
          <p className="text-lg font-medium text-slate-800">
            Verification failed
          </p>
          <p className="max-w-sm text-sm text-slate-500">{message}</p>
          <a
            href="/verify-email"
            className="mt-2 text-sm font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
          >
            Request a new verification link
          </a>
        </>
      )}
    </div>
  );
}
