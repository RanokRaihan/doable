"use client";

import { updateAvatarAction } from "@/actions/user/userAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/providers/AuthProvider";
import { Camera, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { toast } from "sonner";

type Step = "selecting" | "cropping" | "uploading";

async function uploadToCloudinary(
  file: File,
): Promise<{ url: string; publicId: string }> {
  const sigRes = await fetch("/api/cloudinary-signature?type=avatar");
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

async function getCroppedImg(src: string, pixels: Area): Promise<Blob> {
  const response = await fetch(src);
  const blob = await response.blob();
  const img = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = pixels.width;
  canvas.height = pixels.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    pixels.x,
    pixels.y,
    pixels.width,
    pixels.height,
    0,
    0,
    pixels.width,
    pixels.height,
  );
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9),
  );
}

export default function AvatarUploadDialog() {
  const { refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("selecting");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  const reset = () => {
    setStep("selecting");
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setStep("cropping");
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedPixels) return;
    setStep("uploading");
    try {
      const blob = await getCroppedImg(imageSrc, croppedPixels);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const { url } = await uploadToCloudinary(file);
      const result = await updateAvatarAction(url);
      if (!result.success) {
        toast.error("message" in result ? result.message : "Failed to update avatar");
        setStep("cropping");
        return;
      }
      toast.success("Avatar updated successfully");
      refreshUser();
      setOpen(false);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setStep("cropping");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors"
      >
        <Camera className="size-3.5" />
        Update Avatar
      </button>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Avatar</DialogTitle>
          </DialogHeader>

          {step === "selecting" && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 transition-colors py-12 w-full"
            >
              <Camera className="size-10 text-slate-400" />
              <span className="text-sm font-medium text-slate-500">
                Click to select a photo
              </span>
              <span className="text-xs text-slate-400">PNG, JPG, WebP</span>
            </button>
          )}

          {(step === "cropping" || step === "uploading") && imageSrc && (
            <div className="space-y-4">
              <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-900">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="space-y-1.5 px-1">
                <span className="text-xs font-medium text-slate-500">Zoom</span>
                <Slider
                  min={1}
                  max={3}
                  step={0.05}
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  disabled={step === "uploading"}
                />
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
          />

          <DialogFooter className="gap-2">
            {step === "selecting" && (
              <Button
                variant="outline"
                onClick={() => handleOpen(false)}
              >
                Cancel
              </Button>
            )}

            {(step === "cropping" || step === "uploading") && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setStep("selecting")}
                  disabled={step === "uploading"}
                >
                  Back
                </Button>
                <Button onClick={handleConfirm} disabled={step === "uploading"}>
                  {step === "uploading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
