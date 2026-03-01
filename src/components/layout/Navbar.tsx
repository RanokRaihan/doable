"use client";

import { useAuth } from "@/providers/AuthProvider";
import { LogOut, Menu, User, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

const navbarLinks = [
  { name: "Browse Tasks", href: "/tasks" },
  { name: "How it Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Effect to handle scroll state for the glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* replace with actual logo later */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Zap size={20} className="fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear  -to-r from-gray-900 to-gray-700">
              GetItDone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navbarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                    <Avatar size="default">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
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
                    onClick={() => {
                      // TODO: implement logout
                    }}
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
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Button asChild variant="default" className="rounded-full">
                  <Link href="/register">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
            {navbarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {link.name}
              </Link>
            ))}

            <Separator />

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 p-2">
                  <Avatar size="default">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <User size={16} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    // TODO: implement logout
                  }}
                  className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="p-2 text-center bg-blue-600 text-white rounded-lg font-medium"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
