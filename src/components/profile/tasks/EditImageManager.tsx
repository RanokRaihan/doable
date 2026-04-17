"use client";

import { cn } from "@/lib/utils";
import { TaskImage } from "@/lib/types";
import { ImagePlus, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export type PendingFile = {
  id: string;
  file: File;
  preview: string;
};

interface EditImageManagerProps {
  existingImages: TaskImage[];
  removedImageIds: Set<string>;
  pendingFiles: PendingFile[];
  onRemoveExisting: (id: string) => void;
  onRestoreExisting: (id: string) => void;
  onAddFiles: (files: FileList) => void;
  onRemovePending: (id: string) => void;
}

export function EditImageManager({
  existingImages,
  removedImageIds,
  pendingFiles,
  onRemoveExisting,
  onRestoreExisting,
  onAddFiles,
  onRemovePending,
}: EditImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const keptCount = existingImages.length - removedImageIds.size;
  const totalSlots = keptCount + pendingFiles.length;
  const canAdd = totalSlots < 5;
  const hasImages = existingImages.length > 0 || pendingFiles.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Photos{" "}
          <span className="text-muted-foreground font-normal">(up to 5)</span>
        </p>
        <span className="text-muted-foreground text-xs">
          {totalSlots}/5
        </span>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-4">
        {!hasImages ? (
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
            {existingImages.map((img) => {
              const isRemoved = removedImageIds.has(img.id);
              return (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border"
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? "Task photo"}
                    fill
                    className={cn(
                      "object-cover transition-opacity",
                      isRemoved && "opacity-30",
                    )}
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                  {isRemoved ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/20">
                      <button
                        type="button"
                        onClick={() => onRestoreExisting(img.id)}
                        className="rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm hover:bg-white transition-colors"
                        aria-label="Restore photo"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                      <span className="text-[10px] text-white font-medium bg-black/50 px-1.5 py-0.5 rounded">
                        Removed
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRemoveExisting(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {pendingFiles.map((pf) => (
              <div
                key={pf.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-dashed border-primary/40"
              >
                <Image
                  src={pf.preview}
                  alt="New photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => onRemovePending(pf.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="size-3" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 bg-primary/70 px-1 py-0.5 text-center text-[10px] text-white">
                  New
                </span>
              </div>
            ))}

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
        onChange={(e) => {
          if (e.target.files) onAddFiles(e.target.files);
        }}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = "";
        }}
      />
    </div>
  );
}
