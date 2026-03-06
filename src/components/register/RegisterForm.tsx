"use client";
import RegistrationSchema from "@/schema/registrationValidation";
import { Mail, User } from "lucide-react";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

type FormData = z.infer<typeof RegistrationSchema>;

const RegisterForm = () => {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: RegistrationSchema,
    },
    onSubmit: async (values) => {
      // Handle form submission, e.g., call an API to register the user
      console.log("Registration form submitted with values:", values);
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
              label="Full Name"
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
          {(field) => (
            <field.PasswordInputBase
              label="Password"
              placeholder="Enter your password"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordInputBase
              label="Confirm Password"
              placeholder="Confirm your password"
            />
          )}
        </form.AppField>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
