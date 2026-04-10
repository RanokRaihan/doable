"use client";

import { logoutAction } from "@/actions/auth/authAction";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  ChevronDown,
  ClipboardList,
  FileText,
  LogOut,
  Settings,
  Star,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/profile", icon: User },
  { label: "My Tasks", href: "/profile/tasks", icon: ClipboardList },
  { label: "Applications", href: "/profile/applications", icon: FileText },
  { label: "Reviews", href: "/profile/reviews", icon: Star },
  { label: "Wallet", href: "/profile/wallet", icon: Wallet },
];

const allNavItems = [
  ...navItems,
  { label: "Settings", href: "/profile/settings", icon: Settings },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/profile") return pathname === "/profile";
    return pathname.startsWith(href);
  };

  const currentItem =
    allNavItems.find((item) => isActive(item.href)) ?? allNavItems[0];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleLogout = async () => {
    await logoutAction();
    clearUser();
    router.push("/login");
  };

  return (
    <>
      {/* ── Mobile collapsible menu ── */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <currentItem.icon className="size-4 text-blue-600" />
            {currentItem.label}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-slate-400 transition-transform duration-200",
              mobileOpen && "rotate-180",
            )}
          />
        </button>

        {mobileOpen && (
          <div className="mt-1 bg-white border border-slate-200 rounded-xl p-2 flex flex-col gap-0.5 shadow-sm">
            {allNavItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive(href) ? "text-blue-600" : "text-slate-400",
                  )}
                />
                {label}
              </Link>
            ))}

            <div className="my-1 border-t border-slate-100" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="size-4 shrink-0 text-slate-400" />
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-22 self-start">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-5 mb-3">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="size-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg select-none">
              {initials}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                {user?.name ?? "—"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email ?? ""}
              </p>
            </div>

            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                user?.role === "ADMIN"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-blue-50 text-blue-600",
              )}
            >
              {user?.role ?? "USER"}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="bg-white rounded-xl border border-slate-200 px-2 py-2 flex flex-col gap-0.5">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive(href) ? "text-blue-600" : "text-slate-400",
                )}
              />
              {label}
            </Link>
          ))}

          <div className="my-1 border-t border-slate-100" />

          <Link
            href="/profile/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/profile/settings")
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
            )}
          >
            <Settings
              className={cn(
                "size-4 shrink-0",
                isActive("/profile/settings")
                  ? "text-blue-600"
                  : "text-slate-400",
              )}
            />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full mt-0.5"
          >
            <LogOut className="size-4 shrink-0 text-slate-400" />
            Sign out
          </button>
        </nav>
      </aside>
    </>
  );
}
