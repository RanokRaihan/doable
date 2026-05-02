"use client";
import { resetPasswordAction } from "@/actions/auth/authAction";
import ResetPasswordSchema from "@/schema/resetPasswordValidation";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

type FormData = z.infer<typeof ResetPasswordSchema>;

type ResetPasswordFormProps = {
  token: string;
  email: string;
};

const ResetPasswordForm = ({ token, email }: ResetPasswordFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: ResetPasswordSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async (values) => {
      const res = await resetPasswordAction({
        email,
        newPassword: values.value.newPassword,
        resetToken: token,
      });
      if (res?.success) {
        toast.success("Password reset successfully. Please sign in.");
        router.push("/login");
      } else {
        setServerError(
          res?.message || "Failed to reset password. Please try again.",
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="newPassword">
          {(field) => (
            <field.PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              showForgotPassword={false}
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordInput
              label="Confirm Password"
              placeholder="Confirm your new password"
              showForgotPassword={false}
            />
          )}
        </form.AppField>

        {serverError && (
          <div className="space-y-2">
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
            <p className="text-sm text-center text-gray-600">
              Invalid or expired link?{" "}
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Request a new one
              </Link>
            </p>
          </div>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};

export default ResetPasswordForm;
