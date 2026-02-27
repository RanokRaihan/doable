"use client";
import { LoginAction } from "@/actions/auth/authAction";
import { useAuth } from "@/contexts/AuthContext";
import LoginSchema from "@/schema/loginValidation";
import { Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
type FormData = z.infer<typeof LoginSchema>;
const LoginForm = () => {
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
      const res = await LoginAction(values.value);
      console.log("LoginAction response:", res); // Debug log
      if (res?.success) {
        setUser(res.data.user);
        toast.success(res.message || "Logged in successfully!");
        redirect("/");
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
        <Button type="submit">Sign In</Button>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
