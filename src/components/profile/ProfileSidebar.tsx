"use client";

import { logoutAction } from "@/actions/auth/authAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  KeyRound,
  LogOut,
  Pencil,
  Receipt,
  Star,
  User,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/profile", icon: User },
  { label: "My Tasks", href: "/profile/tasks", icon: ClipboardList },
  { label: "Applications", href: "/profile/applications", icon: FileText },
  { label: "Reviews", href: "/profile/reviews", icon: Star },
  { label: "Wallet", href: "/profile/wallet", icon: Wallet },
  { label: "Payments", href: "/profile/payments", icon: CreditCard },
  { label: "Commission Due", href: "/profile/commission-due", icon: Receipt },
  {
    label: "Change Password",
    href: "/profile/change-password",
    icon: KeyRound,
  },
  {
    label: "Update Information",
    href: "/profile/update-information",
    icon: Pencil,
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuth();

  const isActive = (href: string) => {
    if (href === "/profile") return pathname === "/profile";
    return pathname.startsWith(href);
  };

  const currentItem =
    navItems.find((item) => isActive(item.href)) ?? navItems[0];

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
      {/* ── Mobile dropdown (shadcn DropdownMenu) ── */}
      <div className="md:hidden mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-2">
                <currentItem.icon className="size-4 text-blue-600" />
                {currentItem.label}
              </span>
              <ChevronDown className="size-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="min-w-56 p-1.5">
            {navItems.map(({ label, href, icon: Icon }) => (
              <DropdownMenuItem
                key={href}
                asChild
                className={cn(
                  "gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                  isActive(href)
                    ? "bg-blue-50 text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    : "text-slate-600",
                )}
              >
                <Link href={href}>
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive(href) ? "text-blue-600" : "text-slate-400",
                    )}
                  />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="size-4 shrink-0" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-22 self-start">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-5 mb-3">
          <div className="flex flex-col items-center text-center gap-2">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                className="size-14 rounded-full object-cover"
                width={56}
                height={56}
              />
            ) : (
              <div className="size-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg select-none">
                {initials}
              </div>
            )}

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

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="size-4 shrink-0 text-slate-400" />
            Sign out
          </button>
        </nav>
      </aside>
    </>
  );
}
