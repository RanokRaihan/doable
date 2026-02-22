"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const navbarLinks = [
  { name: "Browse Tasks", href: "/tasks" },
  { name: "How it Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

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

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Hello, {user.name}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log In
              </Link>
              <Button asChild variant="default" className=" rounded-full">
                <Link href="/register">Join Now</Link>
              </Button>
            </div>
          )}

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

            <hr className="border-gray-100" />
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
