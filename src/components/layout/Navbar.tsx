"use client";

import { logoutAction } from "@/actions/auth/authAction";
import { useAuth } from "@/providers/AuthProvider";
import { LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const navLinks = [
  { name: "Browse tasks", href: "/tasks" },
  { name: "How it works", href: "/how-it-works" },
  { name: "About us", href: "/about" },
];

function LogoMark() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 no-underline group"
    >
      <div
        className="w-7 h-7 rounded-lg bg-white  flex items-center justify-center text-ds-bg font-bold text-[22px] leading-none select-none"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <Image src="/logo.png" alt="Logo" width={28} height={28} />
        {/* <span style={{ transform: "translateY(-1px)", display: "block" }}>
          •
        </span> */}
      </div>
      <span className="text-[20px] font-semibold tracking-[-0.02em] text-ds-ink">
        doable
      </span>
    </Link>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, clearUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    clearUser();
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(250,250,247,0.82)",
        borderColor: "#e7e5df",
      }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        <div className="flex items-center justify-between h-18">
          <LogoMark />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[14px] font-medium text-ds-ink-2 hover:text-ds-ink transition-colors no-underline"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ds-orange">
                    <span className="text-[14px] font-medium text-ds-ink-2">
                      {user.name}
                    </span>
                    <Avatar size="default" className="border border-ds-line-2">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-[12px]">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center h-9.5 px-4 rounded-full text-[14px] font-medium border text-ds-ink bg-transparent hover:bg-ds-bg-2 transition-all no-underline"
                  style={{ borderColor: "#d8d6cf" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center h-9.5 px-4 rounded-full text-[14px] font-medium bg-ds-ink text-ds-bg hover:bg-[#1e293b] transition-all no-underline"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-ds-ink-2 hover:text-ds-ink transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-8 py-4 flex flex-col gap-1"
          style={{ background: "#fafaf7", borderColor: "#e7e5df" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[14px] font-medium text-ds-ink-2 hover:text-ds-ink hover:bg-ds-bg-2 rounded-xl transition-colors no-underline"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t my-3" style={{ borderColor: "#e7e5df" }} />
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar size="default">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-[14px] font-medium text-ds-ink">
                    {user.name}
                  </div>
                  <div className="text-[12px] text-ds-ink-3">{user.email}</div>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium text-ds-ink-2 hover:bg-ds-bg-2 rounded-xl no-underline"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-xl text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="h-11 flex items-center justify-center rounded-full border text-[14px] font-medium text-ds-ink no-underline"
                style={{ borderColor: "#d8d6cf" }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="h-11 flex items-center justify-center rounded-full bg-ds-ink text-ds-bg text-[14px] font-medium no-underline"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
