import { AuthProvider } from "@/providers/AuthProvider";

import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Doable — Find Help, Get Things Done",
    template: "%s | Doable",
  },
  description:
    "Doable is a community-powered task marketplace. Post tasks, hire trusted local helpers, or earn money doing work on your own schedule.",
  openGraph: {
    type: "website",
    siteName: "Doable",
    title: "Doable — Find Help, Get Things Done",
    description:
      "Post tasks, hire trusted local helpers, or earn money doing work on your own schedule.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Doable — Task Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doable — Find Help, Get Things Done",
    description:
      "Post tasks, hire trusted local helpers, or earn money doing work on your own schedule.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <AuthProvider initialUser={user}>
          <NavigationProgress />
          {children}
          <Toaster position="top-center" duration={3500} richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
