"use client";

import { LoginAction, RegisterAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import RegisterSchema from "@/schema/registerValidation";
import { Loader2, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import ServerErrorDisplay from "../form/ServerErrorDisplay";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

type FormData = z.infer<typeof RegisterSchema>;

const RegisterForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: RegisterSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async (values) => {
      const actionPayload = {
        name: values.value.name,
        email: values.value.email,
        password: values.value.password,
      };
      const loginPayload = {
        email: values.value.email,
        password: values.value.password,
      };

      const res = await RegisterAction(actionPayload);

      if (res?.success) {
        toast.success(res.message || "Account created successfully!");
        setLoadingMessage("logging in...");
        const loginRes = await LoginAction(loginPayload);
        setLoadingMessage(null);
        if (loginRes?.success) {
          setUser(loginRes.data.user);
          toast.success(loginRes.message || "Logged in successfully!");
          const verifyUrl = callbackUrl
            ? `/verify-email?callbackUrl=${encodeURIComponent(callbackUrl)}`
            : "/verify-email";
          router.push(verifyUrl);
        } else {
          toast.error(loginRes?.message || "Login failed. ");
          router.push("/login");
        }
      } else {
        setServerError(
          res?.message || "Registration failed. Please try again.",
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
        <form.AppField name="name">
          {(field) => (
            <field.InputWithIcon
              label="Name"
              placeholder="John Doe"
              type="text"
              icon={User}
            />
          )}
        </form.AppField>

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
          {(field) => <field.PasswordInput showForgotPassword={false} />}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              showForgotPassword={false}
            />
          )}
        </form.AppField>

        {serverError && (
          <ServerErrorDisplay
            serverError={serverError}
            setServerError={setServerError}
          />
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting
                ? loadingMessage || "Creating Account..."
                : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
