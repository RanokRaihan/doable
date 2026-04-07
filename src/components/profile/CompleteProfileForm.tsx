"use client";

import { completeProfileAction } from "@/actions/auth/authAction";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import CompleteProfileSchema from "@/schema/completeProfileValidation";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

type FormData = z.infer<typeof CompleteProfileSchema>;

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export default function CompleteProfileForm({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { refreshUser } = useAuth();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      dateOfBirth: "",
      phone: "",
      address: "",
      bio: "",
      gender: "" as FormData["gender"],
    } satisfies FormData as FormData,
    validators: {
      onSubmit: CompleteProfileSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async (values) => {
      const result = await completeProfileAction(values.value);

      if (result.success) {
        toast.success("Profile completed!");
        refreshUser();
        router.push(callbackUrl || "/profile");
      } else {
        setServerError(
          "message" in result
            ? result.message
            : "Something went wrong. Please try again.",
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
        {/* Date of birth */}
        <form.Field name="dateOfBirth">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Date of birth</FieldLabel>
                </FieldContent>
                <Input
                  id={field.name}
                  type="date"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  max={new Date().toISOString().split("T")[0]}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Phone */}
        <form.AppField name="phone">
          {(field) => (
            <field.InputWithIcon
              label="Phone number"
              placeholder="e.g. 01783687070"
              type="tel"
              icon={() => (
                <span className="text-xs font-medium text-slate-400">TEL</span>
              )}
            />
          )}
        </form.AppField>

        {/* Address */}
        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="123 Main St, City, Country"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Bio */}
        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    Bio{" "}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </FieldLabel>
                </FieldContent>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="Tell us a little about yourself..."
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  rows={3}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Gender */}
        <form.Field name="gender">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                </FieldContent>
                <Select
                  value={field.state.value}
                  onValueChange={(val) =>
                    field.handleChange(val as FormData["gender"])
                  }
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

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
              {isSubmitting ? "Saving..." : "Complete profile"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
