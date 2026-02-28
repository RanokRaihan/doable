import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";

export interface TokenPayload {
  role?: string;
  exp?: number;
}

export interface RefreshedTokens {
  accessToken: string;
  refreshToken?: string;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
    return decoded;
  } catch {
    return null;
  }
}

export function isTokenValid(tokenData: TokenPayload | null): boolean {
  return !!(tokenData && tokenData.exp && tokenData.exp * 1000 > Date.now());
}

export function isTokenExpiringSoon(tokenData: TokenPayload | null): boolean {
  if (!tokenData?.exp) return false;
  const bufferMs = 60 * 1000; // 60 seconds
  return tokenData.exp * 1000 - Date.now() < bufferMs;
}

export async function refreshTokens(
  refreshToken: string,
): Promise<RefreshedTokens | null> {
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

    if (!response.ok) return null;

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
): void {
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}

export function clearTokenCookies(response: NextResponse): void {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
}
