"use client";
import { forgotPasswordAction } from "@/actions/auth/authAction";
import ForgotPasswordSchema from "@/schema/forgotPasswordValidation";
import { CheckCircle2, Loader2, Mail, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

type FormData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: ForgotPasswordSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async (values) => {
      const res = await forgotPasswordAction({ email: values.value.email });
      if (res?.success) {
        setSubmitted(true);
      } else {
        setServerError(
          res?.message || "Something went wrong. Please try again.",
        );
      }
    },
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">Check your inbox</p>
          <p className="text-sm text-gray-500">
            If an account exists for that email, we&apos;ve sent a password
            reset link. The link expires in 15 minutes.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.InputWithIcon
              label="Email"
              placeholder="johndoe@example.com"
              type="email"
              icon={Mail}
            />
          )}
        </form.AppField>

        {serverError && (
          <div className="flex items-center justify-between gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{serverError}</span>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="shrink-0 rounded p-0.5 hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};

export default ForgotPasswordForm;
