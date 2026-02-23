import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return NextResponse.json(
        { success: false, message: "Refresh failed" },
        { status: 401 },
      );
    }

    const data = await response.json();
    console.log("token data from route handler", data);
    if (data.success && data.data?.accessToken) {
      console.log("Setting new access token cookie");

      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });

      if (data.data.refreshToken) {
        cookieStore.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
      }

      return NextResponse.json({
        success: true,
        data: { accessToken: data.data.accessToken },
      });
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json(
      { success: false, message: "Invalid response" },
      { status: 401 },
    );
  } catch {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json(
      { success: false, message: "Refresh error" },
      { status: 500 },
    );
  }
}
