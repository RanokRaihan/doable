"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownToLine, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Withdrawal Methods",
    href: "/profile/withdrawal/methods",
    icon: Wallet,
  },
  {
    label: "Withdrawal Requests",
    href: "/profile/withdrawal/requests",
    icon: ArrowDownToLine,
  },
] as const;

export function WithdrawalTabNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 border-b border-slate-200">
      {tabs.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors",
              isActive
                ? "border-blue-600 text-blue-700 bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
