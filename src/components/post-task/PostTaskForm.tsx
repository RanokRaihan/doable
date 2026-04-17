"use client";

import {
  PostTaskPayload,
  postTaskAction,
  postTaskImagesAction,
} from "@/actions/task/taskAction";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  TaskCategory,
  TaskCategoryType,
  TaskPriority,
  TaskPriorityType,
} from "@/lib/types";
import PostTaskSchema, { PostTaskFormData } from "@/schema/postTaskValidation";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Tag,
  X,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";
import LocationPicker from "./LocationPicker";

const DRAFT_KEY = "post-task-draft";
const IMAGES_KEY = "post-task-draft-images";
const DEBOUNCE_MS = 800;

const CATEGORY_OPTIONS = Object.values(TaskCategory).map((val) => ({
  label: val
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  value: val,
}));

const PRIORITY_OPTIONS = Object.values(TaskPriority).map((val) => ({
  label: val.charAt(0) + val.slice(1).toLowerCase(),
  value: val,
}));

const SECTION_CLASSES = "rounded-xl border bg-card p-5 space-y-5 shadow-xs";

const SECTION_TITLE_CLASSES = "flex items-center gap-2 text-base font-semibold";

const PostTaskForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coords, setCoords] = useState<{
    latitude?: number;
    longitude?: number;
  }>({});
  const [coordsError, setCoordsError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      category: "" as TaskCategoryType,
      priority: "MEDIUM" as TaskPriorityType,
      location: "",
      baseCompensation: 0,
      scheduledAt: "",
      estimatedDuration: 0,
      expiresAt: "",
    } as PostTaskFormData,
    validators: {
      onSubmit: PostTaskSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (serverError) setServerError(null);
        // Debounce localStorage save
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          try {
            localStorage.setItem(
              DRAFT_KEY,
              JSON.stringify(formApi.state.values),
            );
          } catch {
            // Storage might be full; ignore
          }
        }, DEBOUNCE_MS);
      },
    },
    onSubmit: async ({ value }) => {
      if (coords.latitude === undefined || coords.longitude === undefined) {
        setCoordsError(
          "Please select a location from the suggestions so we can resolve its coordinates.",
        );
        return;
      }
      const res = await postTaskAction({
        ...value,
        ...coords,
      } as PostTaskPayload);

      if (!res?.success) {
        setServerError(
          res?.message ?? "Failed to post task. Please try again.",
        );
        return;
      }

      const taskId = res.data.id;

      // Two-step: attach images if any were uploaded
      if (imageUrls.length > 0) {
        await postTaskImagesAction(
          taskId,
          imageUrls.map((url) => ({ url })),
        );
      }

      // Clear draft
      try {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(IMAGES_KEY);
      } catch {
        // Ignore
      }

      toast.success("Task posted successfully!");
      redirect(`/tasks/${taskId}`);
    },
  });

  // Hydrate form from localStorage draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: Partial<PostTaskFormData> = JSON.parse(raw);
      const fields = Object.keys(draft) as Array<keyof PostTaskFormData>;
      fields.forEach((key) => {
        const val = draft[key];
        if (val !== undefined && val !== null) {
          form.setFieldValue(key, val as never);
        }
      });
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationChange = useCallback(
    ({
      location,
      latitude,
      longitude,
    }: {
      location: string;
      latitude?: number;
      longitude?: number;
    }) => {
      form.setFieldValue("location", location);
      form.setFieldMeta("location", (prev) => ({ ...prev, isTouched: true }));
      setCoords({ latitude, longitude });
      if (latitude !== undefined && longitude !== undefined)
        setCoordsError(null);
    },
    [form],
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* ── Images ─────────────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            1
          </span>
          Photos
        </h2>
        <ImageUploader onImagesChange={setImageUrls} />
      </div>

      {/* ── Basic Info ─────────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            2
          </span>
          Basic Info
        </h2>
        <FieldGroup>
          <form.AppField name="title">
            {(field) => (
              <field.InputWithIcon
                label="Title"
                placeholder="e.g. Fix leaking kitchen sink"
                icon={Briefcase}
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextAreaField
                label="Description"
                placeholder="Describe the task in detail — what needs to be done, any special requirements, tools needed, etc."
                rows={5}
              />
            )}
          </form.AppField>

          <form.AppField name="category">
            {(field) => (
              <field.SelectField
                label="Category"
                options={CATEGORY_OPTIONS}
                placeholder="Select a category"
              />
            )}
          </form.AppField>
        </FieldGroup>
      </div>

      {/* ── Scheduling ─────────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            3
          </span>
          Scheduling
        </h2>
        <FieldGroup>
          <form.AppField name="scheduledAt">
            {(field) => <field.DateTimeField label="Scheduled Date & Time" />}
          </form.AppField>

          <form.AppField name="estimatedDuration">
            {(field) => (
              <field.NumberInputField
                label="Estimated Duration"
                placeholder="e.g. 120"
                description="In minutes (e.g. 60 = 1 hour, 120 = 2 hours)"
                min={1}
              />
            )}
          </form.AppField>

          <form.AppField name="expiresAt">
            {(field) => (
              <field.DateTimeField label="Listing Expires At (optional)" />
            )}
          </form.AppField>
        </FieldGroup>
      </div>

      {/* ── Location ───────────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            4
          </span>
          Location
        </h2>
        <form.AppField name="location">
          {(field) => (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin className="text-muted-foreground size-3.5" />
                Where should the task be done?
              </div>
              <LocationPicker
                value={field.state.value}
                onLocationChange={handleLocationChange}
                isInvalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
              {coordsError && (
                <p className="text-destructive text-sm">{coordsError}</p>
              )}
            </div>
          )}
        </form.AppField>
      </div>

      {/* ── Compensation & Priority ────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            5
          </span>
          Compensation & Priority
        </h2>
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <form.AppField name="baseCompensation">
              {(field) => (
                <field.NumberInputField
                  label="Base Compensation"
                  placeholder="0.00"
                  description="Amount you're offering to pay (USD)"
                  prefix="$"
                  min={1}
                  step={0.01}
                />
              )}
            </form.AppField>

            <form.AppField name="priority">
              {(field) => (
                <field.SelectField
                  label="Priority"
                  options={PRIORITY_OPTIONS}
                  placeholder="Select priority"
                />
              )}
            </form.AppField>
          </div>
        </FieldGroup>

        {/* Priority hints */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            {
              val: "LOW",
              color: "bg-green-50 border-green-200 text-green-700",
              hint: "Flexible timeline",
            },
            {
              val: "MEDIUM",
              color: "bg-blue-50 border-blue-200 text-blue-700",
              hint: "Within a few days",
            },
            {
              val: "HIGH",
              color: "bg-orange-50 border-orange-200 text-orange-700",
              hint: "Needed soon",
            },
            {
              val: "URGENT",
              color: "bg-red-50 border-red-200 text-red-700",
              hint: "ASAP",
            },
          ].map(({ val, color, hint }) => (
            <div
              key={val}
              className={`rounded-lg border px-3 py-2 text-xs ${color}`}
            >
              <span className="font-medium">
                {val.charAt(0) + val.slice(1).toLowerCase()}
              </span>
              <p className="mt-0.5 opacity-80">{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extra fields ───────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <Tag className="text-muted-foreground size-5" />
          Additional Details
        </h2>
        <FieldGroup>
          {/* Calendar icon legend */}
          <div className="text-muted-foreground flex items-center gap-4 rounded-lg bg-muted/40 px-4 py-3 text-xs">
            <Calendar className="size-4 shrink-0" />
            <span>
              <strong>Scheduled At</strong> — when you need the task done.{" "}
              <strong>Expires At</strong> — when the listing closes if no one
              applies (optional).
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 rounded-lg bg-muted/40 px-4 py-3 text-xs">
            <Clock className="size-4 shrink-0" />
            <span>
              <strong>Estimated Duration</strong> helps workers plan their day.
              Enter the expected total time in minutes.
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 rounded-lg bg-muted/40 px-4 py-3 text-xs">
            <DollarSign className="size-4 shrink-0" />
            <span>
              <strong>Base Compensation</strong> is your initial offer. Workers
              may propose a different amount when they apply.
            </span>
          </div>
        </FieldGroup>
      </div>

      {/* ── Server error ───────────────────────────────── */}
      {serverError && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{serverError}</span>
          </div>
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

      {/* ── Submit ─────────────────────────────────────── */}
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Posting Task…" : "Post Task"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default PostTaskForm;
