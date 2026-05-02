"use client";

import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_IMAGES = 5;
const STORAGE_KEY = "post-task-draft-images";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type UploadedImage = {
  url: string;
  publicId: string;
};

type StoredImages = {
  images: UploadedImage[];
  savedAt: string;
};

type UploadingFile = {
  id: string;
  preview: string;
  status: "uploading" | "error";
  errorMessage?: string;
};

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
};

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

const ImageUploader = ({ onImagesChange }: ImageUploaderProps) => {
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load persisted images on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: StoredImages = JSON.parse(raw);
      const age = Date.now() - new Date(stored.savedAt).getTime();
      if (age > TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      setUploaded(stored.images);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist whenever uploaded list changes
  useEffect(() => {
    if (uploaded.length === 0) return;
    const stored: StoredImages = {
      images: uploaded,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [uploaded]);

  // Sync uploaded images to parent
  useEffect(() => {
    onImagesChange(uploaded.map((i) => i.url));
  }, [uploaded, onImagesChange]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const remaining = MAX_IMAGES - uploaded.length - uploading.length;
      const toUpload = Array.from(files).slice(0, remaining);
      if (toUpload.length === 0) return;

      const newUploading: UploadingFile[] = toUpload.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        preview: URL.createObjectURL(file),
        status: "uploading",
      }));
      setUploading((prev) => [...prev, ...newUploading]);

      await Promise.all(
        toUpload.map(async (file, idx) => {
          const entry = newUploading[idx];
          try {
            const result = await uploadToCloudinary(file);
            setUploaded((prev) => [...prev, result]);
          } catch {
            setUploading((prev) =>
              prev.map((u) =>
                u.id === entry.id
                  ? { ...u, status: "error", errorMessage: "Upload failed" }
                  : u,
              ),
            );
          } finally {
            setUploading((prev) =>
              prev.filter(
                (u) =>
                  u.id !== entry.id ||
                  uploading.find(
                    (u2) => u2.id === entry.id && u2.status === "error",
                  ),
              ),
            );
          }
        }),
      );
      // Clean up successful uploading entries
      setUploading((prev) => prev.filter((u) => u.status === "error"));
    },
    [uploaded, uploading],
  );

  const removeUploaded = (publicId: string) => {
    setUploaded((prev) => {
      const next = prev.filter((i) => i.publicId !== publicId);
      if (next.length === 0) localStorage.removeItem(STORAGE_KEY);
      return next;
    });
  };

  const dismissError = (id: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  };

  const totalSlots = uploaded.length + uploading.length;
  const canAdd = totalSlots < MAX_IMAGES;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Photos{" "}
          <span className="text-muted-foreground font-normal">
            (up to {MAX_IMAGES})
          </span>
        </p>
        <span className="text-muted-foreground text-xs">
          {totalSlots}/{MAX_IMAGES}
        </span>
      </div>

      <div
        ref={dragRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border-2 border-dashed p-4 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30",
        )}
      >
        {totalSlots === 0 ? (
          // Empty state
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 py-6 text-center"
          >
            <ImagePlus className="text-muted-foreground size-8" />
            <span className="text-muted-foreground text-sm">
              Drag & drop photos here, or{" "}
              <span className="text-primary font-medium underline underline-offset-2">
                browse
              </span>
            </span>
            <span className="text-muted-foreground text-xs">
              PNG, JPG, WebP — max 5 photos
            </span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {/* Uploaded images */}
            {uploaded.map((img) => (
              <div
                key={img.publicId}
                className="group relative aspect-square overflow-hidden rounded-lg border"
              >
                <Image
                  src={img.url}
                  alt="Task photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <button
                  type="button"
                  onClick={() => removeUploaded(img.publicId)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}

            {/* Uploading / error slots */}
            {uploading.map((u) => (
              <div
                key={u.id}
                className="relative aspect-square overflow-hidden rounded-lg border"
              >
                <Image
                  src={u.preview}
                  alt="Uploading"
                  fill
                  className={cn(
                    "object-cover",
                    u.status === "error" && "opacity-40",
                  )}
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {u.status === "uploading" ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => dismissError(u.id)}
                      className="rounded-full bg-destructive p-1 text-white"
                      aria-label="Dismiss error"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
                {u.status === "error" && (
                  <span className="absolute bottom-0 left-0 right-0 bg-destructive/80 px-1 py-0.5 text-center text-[10px] text-white">
                    Failed
                  </span>
                )}
              </div>
            ))}

            {/* Add more slot */}
            {canAdd && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-muted hover:bg-muted/80 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                aria-label="Add photo"
              >
                <ImagePlus className="text-muted-foreground size-6" />
              </button>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => {
          // Reset so same file can be re-selected
          (e.target as HTMLInputElement).value = "";
        }}
      />
    </div>
  );
};

export default ImageUploader;
