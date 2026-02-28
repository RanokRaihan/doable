import { AuthProvider } from "@/providers/AuthProvider";

import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Get It Done - Helper Marketplace",
  description: "A marketplace to find helpers for your tasks.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  console.log(user);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider initialUser={user}>
          {children}
          <Toaster position="top-center" duration={3500} richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
