"use server";

import { cookies } from "next/headers";

type SameSite = "lax" | "strict" | "none";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: SameSite;
  path?: string;
  maxAge?: number;
  expires?: Date;
}

const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

async function setCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value, { ...defaultOptions, ...options });
}

async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

async function hasCookie(name: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}

export { deleteCookie, getCookie, hasCookie, setCookie };
