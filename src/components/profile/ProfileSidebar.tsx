"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardList,
  FileText,
  Settings,
  Star,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/profile", icon: User },
  { label: "My Tasks", href: "/profile/tasks", icon: ClipboardList },
  { label: "Applications", href: "/profile/applications", icon: FileText },
  { label: "Reviews", href: "/profile/reviews", icon: Star },
  { label: "Wallet", href: "/profile/wallet", icon: Wallet },
  { label: "Settings", href: "/profile/settings", icon: Settings },
] as const;

interface ProfileSidebarProps {
  variant: "sidebar" | "tabs";
}

export function ProfileSidebar({ variant }: ProfileSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/profile") return pathname === "/profile";
    return pathname.startsWith(href);
  }

  if (variant === "tabs") {
    return (
      <div className="overflow-x-auto pb-2 mb-6 border-b border-slate-200">
        <div className="flex gap-1 min-w-max">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                isActive(href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-blue-50/50 hover:text-blue-600"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-2">
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive(href)
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-slate-600 hover:bg-blue-50/50 hover:text-blue-600"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
