"use client";

import { changePasswordAction } from "@/actions/auth/authAction";
import { useAppForm } from "@/components/form/hooks";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import ChangePasswordSchema from "@/schema/changePasswordValidation";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";

type FormData = z.infer<typeof ChangePasswordSchema>;

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useAppForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    } satisfies FormData as FormData,
    validators: { onSubmit: ChangePasswordSchema },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
        if (success) setSuccess(false);
      },
    },
    onSubmit: async ({ value }) => {
      const res = await changePasswordAction({
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      });

      if (res.success) {
        toast.success("Password updated successfully");
        setSuccess(true);
        form.reset();
      } else {
        setServerError(
          "message" in res ? res.message : "Something went wrong. Please try again.",
        );
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Security notice */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            Keep your account secure
          </p>
          <p className="mt-0.5 text-sm text-blue-600">
            Use a strong, unique password. After updating, you&apos;ll stay
            signed in on this device.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
          <Check className="size-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            Password updated successfully.
          </p>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-5">
            {/* Current password */}
            <form.AppField name="oldPassword">
              {(field) => (
                <field.PasswordInput
                  label="Current Password"
                  placeholder="Enter your current password"
                  showForgotPassword={false}
                />
              )}
            </form.AppField>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* New password + live requirements */}
            <div className="space-y-3">
              <form.AppField name="newPassword">
                {(field) => (
                  <field.PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    showForgotPassword={false}
                  />
                )}
              </form.AppField>

              <form.Subscribe selector={(s) => s.values.newPassword}>
                {(newPassword) =>
                  newPassword.length > 0 && (
                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                      {requirements.map(({ label, test }) => {
                        const met = test(newPassword);
                        return (
                          <li
                            key={label}
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-medium transition-colors",
                              met ? "text-emerald-600" : "text-slate-400",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-full",
                                met
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-slate-100 text-slate-400",
                              )}
                            >
                              {met ? (
                                <Check className="size-2.5 stroke-[3]" />
                              ) : (
                                <X className="size-2.5 stroke-[3]" />
                              )}
                            </span>
                            {label}
                          </li>
                        );
                      })}
                    </ul>
                  )
                }
              </form.Subscribe>
            </div>

            {/* Confirm new password */}
            <form.AppField name="confirmNewPassword">
              {(field) => (
                <field.PasswordInput
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  showForgotPassword={false}
                />
              )}
            </form.AppField>

            {/* Server error */}
            {serverError && (
              <div className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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

            {/* Submit */}
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-slate-400">
                    Make sure your new password is something you&apos;ll
                    remember.
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="shrink-0"
                  >
                    {isSubmitting && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
