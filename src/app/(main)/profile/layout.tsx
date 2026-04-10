import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-profile-layout className="max-w-6xl mx-auto px-4 py-8">
      {/* Mobile tab bar */}
      <div className="lg:hidden">
        <ProfileSidebar variant="tabs" />
      </div>

      {/* Desktop: sidebar + content */}
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <ProfileSidebar variant="sidebar" />
          </div>
        </aside>
        <main className="flex-1 min-w-0 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
