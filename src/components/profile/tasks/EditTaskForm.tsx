"use client";

import {
  PostTaskPayload,
  UpdateTaskImagesPayload,
  updateTaskAction,
  updateTaskImagesAction,
} from "@/actions/task/taskAction";
import { useAppForm } from "@/components/form/hooks";
import LocationPicker from "@/components/post-task/LocationPicker";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { TaskCategory, TaskDetails, TaskPriority } from "@/lib/types";
import PostTaskSchema, { PostTaskFormData } from "@/schema/postTaskValidation";
import { AlertCircle, Briefcase, Loader2, MapPin, X } from "lucide-react";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EditImageManager, PendingFile } from "./EditImageManager";

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

// Past-epoch date allows pre-existing past scheduled times to display correctly
const NO_MIN_DATE = new Date(0);

type LoadingState = "idle" | "uploading" | "updating-images" | "updating-task";

const submitLabels: Record<LoadingState, string> = {
  idle: "Save Changes",
  uploading: "Uploading images...",
  "updating-images": "Updating images...",
  "updating-task": "Saving task...",
};

type UploadedImage = { url: string; publicId: string };

async function uploadToCloudinary(file: File): Promise<UploadedImage> {
  const sigRes = await fetch("/api/cloudinary-signature");
  if (!sigRes.ok) throw new Error("Failed to get upload signature");
  const { signature, timestamp, apiKey, cloudName, folder } =
    await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!uploadRes.ok) throw new Error("Upload failed");
  const data = await uploadRes.json();
  return { url: data.secure_url, publicId: data.public_id };
}

interface EditTaskFormProps {
  task: TaskDetails;
}

export function EditTaskForm({ task }: EditTaskFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [coords, setCoords] = useState<{
    latitude?: number;
    longitude?: number;
  }>({ latitude: task.latitude, longitude: task.longitude });
  const [coordsError, setCoordsError] = useState<string | null>(null);

  const [existingImages] = useState(task.images);
  const [removedImageIds, setRemovedImageIds] = useState<Set<string>>(
    new Set(),
  );
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  // Revoke ObjectURLs to prevent memory leaks
  useEffect(() => {
    return () => {
      pendingFiles.forEach((pf) => URL.revokeObjectURL(pf.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveExisting = useCallback((id: string) => {
    setRemovedImageIds((prev) => new Set([...prev, id]));
  }, []);

  const handleRestoreExisting = useCallback((id: string) => {
    setRemovedImageIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleAddFiles = useCallback(
    (files: FileList) => {
      const keptCount = existingImages.length - removedImageIds.size;
      const remaining = 5 - keptCount - pendingFiles.length;
      const toAdd = Array.from(files).slice(0, remaining);
      if (toAdd.length === 0) return;

      const newPending: PendingFile[] = toAdd.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));
      setPendingFiles((prev) => [...prev, ...newPending]);
    },
    [existingImages.length, removedImageIds.size, pendingFiles.length],
  );

  const handleRemovePending = useCallback((id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((pf) => pf.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((pf) => pf.id !== id);
    });
  }, []);

  const form = useAppForm({
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      category: task.category,
      priority: task.priority,
      location: task.location,
      baseCompensation: parseFloat(task.baseCompensation),
      scheduledAt: task.scheduledAt,
      estimatedDuration: task.estimatedDuration ?? 0,
      expiresAt: task.expiresAt ?? "",
    } as PostTaskFormData,
    validators: {
      onSubmit: PostTaskSchema,
    },
    listeners: {
      onChange: () => {
        if (serverError) setServerError(null);
      },
    },
    onSubmit: async ({ value }) => {
      if (coords.latitude === undefined || coords.longitude === undefined) {
        setCoordsError(
          "Please select a location from the suggestions so we can resolve its coordinates.",
        );
        return;
      }

      setLoadingState("uploading");

      // Upload new images to Cloudinary
      let newImages: UpdateTaskImagesPayload["newImages"] = [];
      if (pendingFiles.length > 0) {
        const results = await Promise.allSettled(
          pendingFiles.map((pf) => uploadToCloudinary(pf.file)),
        );
        const failed = results.filter((r) => r.status === "rejected");
        if (failed.length > 0) {
          setServerError(
            `${failed.length} image(s) failed to upload. Please try again.`,
          );
          setLoadingState("idle");
          return;
        }
        newImages = (results as PromiseFulfilledResult<UploadedImage>[]).map(
          (r) => ({ url: r.value.url }),
        );
      }

      // PATCH images
      setLoadingState("updating-images");
      const keepImageIds = existingImages
        .filter((img) => !removedImageIds.has(img.id))
        .map((img) => img.id);

      const imageResult = await updateTaskImagesAction(task.id, {
        keepImageIds,
        newImages,
      });

      if (!imageResult.success) {
        setServerError(imageResult.message ?? "Failed to update images.");
        setLoadingState("idle");
        return;
      }

      // PATCH text fields
      setLoadingState("updating-task");
      const taskResult = await updateTaskAction(task.id, {
        ...value,
        ...coords,
      } as PostTaskPayload);

      if (!taskResult.success) {
        setServerError(taskResult.message ?? "Failed to update task.");
        setLoadingState("idle");
        return;
      }

      toast.success("Task updated successfully!");
      redirect("/profile/tasks");
    },
  });

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

  const isSubmitting = loadingState !== "idle";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* ── 1. Photos ──────────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            1
          </span>
          Photos
        </h2>
        <EditImageManager
          existingImages={existingImages}
          removedImageIds={removedImageIds}
          pendingFiles={pendingFiles}
          onRemoveExisting={handleRemoveExisting}
          onRestoreExisting={handleRestoreExisting}
          onAddFiles={handleAddFiles}
          onRemovePending={handleRemovePending}
        />
      </div>

      {/* ── 2. Basic Info ──────────────────────────────── */}
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

      {/* ── 3. Scheduling ─────────────────────────────── */}
      <div className={SECTION_CLASSES}>
        <h2 className={SECTION_TITLE_CLASSES}>
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-sm font-bold">
            3
          </span>
          Scheduling
        </h2>
        <FieldGroup>
          <form.AppField name="scheduledAt">
            {(field) => (
              <field.DateTimeField
                label="Scheduled Date & Time"
                minDate={NO_MIN_DATE}
              />
            )}
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
              <field.DateTimeField
                label="Listing Expires At (optional)"
                minDate={NO_MIN_DATE}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </div>

      {/* ── 4. Location ───────────────────────────────── */}
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

      {/* ── 5. Compensation & Priority ────────────────── */}
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
                  description="Amount you're offering to pay (BDT)"
                  prefix="৳"
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

      {/* ── Server error ──────────────────────────────── */}
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

      {/* ── Submit ────────────────────────────────────── */}
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(formSubmitting) => (
          <Button
            type="submit"
            size="lg"
            disabled={formSubmitting || isSubmitting}
            className="w-full"
          >
            {(formSubmitting || isSubmitting) && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {submitLabels[loadingState]}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
