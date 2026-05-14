import type { Metadata } from "next";
import OnboardingBanner from "@/components/profile/OnboardingBanner";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-profile-layout className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-8 space-y-6">
        <OnboardingBanner />
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <ProfileSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
