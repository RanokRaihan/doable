"use client";

import { type MyProfile, updateProfileAction } from "@/actions/user/userAction";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";
import UpdateProfileSchema from "@/schema/updateProfileValidation";
import { Loader2, MapPin, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";

type FormData = z.infer<typeof UpdateProfileSchema>;

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

type Props = Pick<
  MyProfile,
  "name" | "dateOfBirth" | "phone" | "address" | "bio" | "gender"
>;

export default function UpdateInformationForm(props: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const form = useAppForm({
    defaultValues: {
      name: props.name ?? "",
      dateOfBirth: props.dateOfBirth ? props.dateOfBirth.split("T")[0] : "",
      phone: props.phone ?? "",
      address: props.address ?? "",
      bio: props.bio ?? "",
      gender: (props.gender ?? "") as FormData["gender"],
    } satisfies FormData as FormData,
    validators: {
      onSubmit: UpdateProfileSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async (values) => {
      // Strip empty / undefined fields — all are optional on the API
      const payload = Object.fromEntries(
        Object.entries(values.value).filter(
          ([, v]) => v !== "" && v !== undefined && v !== null,
        ),
      ) as Parameters<typeof updateProfileAction>[0];

      const result = await updateProfileAction(payload);

      if (result.success) {
        toast.success("Profile updated successfully!");
        refreshUser();
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
        {/* Name */}
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

        {/* Date of birth */}
        <form.Field name="dateOfBirth">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
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
              label="Phone Number"
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
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="123 Main St, City, Country"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="pl-9"
                  />
                </div>
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
                  value={field.state.value ?? ""}
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

        {/* Bio */}
        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                </FieldContent>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="Tell us a little about yourself..."
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  rows={4}
                />
                <form.Subscribe selector={(s) => s.values.bio}>
                  {(bio) => (
                    <p className="text-xs text-slate-400 text-right">
                      {(bio ?? "").length} / 500
                    </p>
                  )}
                </form.Subscribe>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
