import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary environment variables are not configured" },
      { status: 500 },
    );
  }

  const type = new URL(request.url).searchParams.get("type");
  const timestamp = Math.round(Date.now() / 1000);
  const folder =
    type === "avatar"
      ? (process.env.CLOUDINARY_AVATAR_FOLDER ?? "doable/avatars")
      : (process.env.CLOUDINARY_FOLDER ?? "doable/tasks");

  // Signature string: all parameters sorted alphabetically + API secret
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha256")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
