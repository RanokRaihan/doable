"use client";
import { LoginAction } from "@/actions/auth/authAction";
import LoginSchema from "@/schema/loginValidation";
import { Mail } from "lucide-react";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
type FormData = z.infer<typeof LoginSchema>;
const LoginForm = () => {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    } satisfies FormData as FormData,
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: async (values) => {
      const res = await LoginAction(values.value);
      if (res?.success) {
        // handle successful login (e.g., redirect, show message)
        console.log("Login successful!", res.data.user);
      } else {
        // handle login failure (e.g., show error message)
        console.log("Login failed:", res);
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
        <Button type="submit">Sign In</Button>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
