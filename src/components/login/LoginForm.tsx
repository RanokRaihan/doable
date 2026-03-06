"use client";
import { LoginAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import LoginSchema from "@/schema/loginValidation";
import { Loader2, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
type FormData = z.infer<typeof LoginSchema>;
const LoginForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  // const [serverError, setServerError] = useState<string | null>(null);
  const { setUser } = useAuth();
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
      const actionPayload = {
        email: values.value.email,
        password: values.value.password,
        remember: values.value.remember,
      };
      const res = await LoginAction(actionPayload);
      if (res?.success) {
        setUser(res.data.user);
        toast.success(res.message || "Logged in successfully!");
        if (callbackUrl) {
          redirect(callbackUrl);
        } else {
          redirect("/dashboard");
        }
      } else {
        // setServerError(res?.message || "Login failed. Please try again.");
        toast.error(res?.message || "Login failed. Please try again.");
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
        {/* {serverError && (
          <p className="text-red-500 bg-red-100 border border-red-500">
            {serverError}
          </p>
        )} */}
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
  );
};

export default LoginForm;
