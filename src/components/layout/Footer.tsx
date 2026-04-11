import { Github, Heart, Linkedin, Twitter, Zap } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Zap size={20} className="fill-current" />
              </div>
              <span className="text-xl font-bold text-slate-100">
                GetItDone
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              The modern marketplace for getting tasks completed. Connect with
              skilled helpers in your neighborhood instantly and securely.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 hover:border-white transition-all"
              >
                <Github size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/post-task"
                  className="hover:text-blue-400 transition-colors"
                >
                  Post a Task
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="hover:text-blue-400 transition-colors"
                >
                  Browse Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-blue-400 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-blue-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="hover:text-blue-400 transition-colors"
                >
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GetItDone Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-current" />
            <span>by Ranok Raihan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
