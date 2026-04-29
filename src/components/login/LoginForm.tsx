"use client";
import { LoginAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import LoginSchema from "@/schema/loginValidation";
import { Loader2, Mail, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FieldGroup } from "../ui/field";
type FormData = z.infer<typeof LoginSchema>;
const LoginForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    } satisfies FormData as FormData,
    validators: {
      onSubmit: LoginSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async (values) => {
      const actionPayload = {
        email: values.value.email,
        password: values.value.password,
        remember: values.value.remember,
      };
      const res = await LoginAction(actionPayload);
      if (res?.success) {
        setUser(res.data.user);
        toast.success(res.message || "Logged in successfully!");
        router.push(callbackUrl || "/profile");
      } else if (res?.statusCode === 423) {
        setLockedDialogOpen(true);
      } else {
        setServerError(res?.message || "Login failed. Please try again.");
      }
    },
  });
  return (
    <>
      <Dialog open={lockedDialogOpen} onOpenChange={setLockedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Temporarily Locked</DialogTitle>
            <DialogDescription>
              Too many failed login attempts. Please try again later or reset
              your password to regain access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLockedDialogOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href="/forgot-password">Reset Password</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <form.AppField name="password">
          {(field) => <field.PasswordInput />}
        </form.AppField>
        <form.AppField name="remember">
          {(field) => <field.Checkbox label="Remember me" />}
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
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
    </>
  );
};

export default LoginForm;
