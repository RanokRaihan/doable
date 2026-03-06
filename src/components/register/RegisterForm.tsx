"use client";

import { RegisterAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import RegisterSchema from "@/schema/registerValidation";
import { Loader2, Mail, User } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

type FormData = z.infer<typeof RegisterSchema>;

const RegisterForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const { setUser } = useAuth();

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
    onSubmit: async (values) => {
      const actionPayload = {
        name: values.value.name,
        email: values.value.email,
        password: values.value.password,
      };

      const res = await RegisterAction(actionPayload);

      if (res?.success) {
        setUser(res.data.user);
        toast.success(res.message || "Account created successfully!");
        if (callbackUrl) {
          redirect(callbackUrl);
        } else {
          redirect("/dashboard");
        }
      } else {
        toast.error(res?.message || "Registration failed. Please try again.");
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

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
