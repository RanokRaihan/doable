import { cookieConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const redirectTo = searchParams.get("redirect") ?? "/login";
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/login";

  const response = NextResponse.redirect(new URL(safeRedirect, origin));

  // Deletion attributes must exactly match the original set attributes
  // or browsers silently ignore the deletion.
  const deletionOptions = {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
    maxAge: 0,
  };

  response.cookies.set("accessToken", "", deletionOptions);
  response.cookies.set("refreshToken", "", deletionOptions);

  return response;
}
