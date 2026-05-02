import { CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

const ResetPasswordLeftSection = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Soft accent gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <Link href="/" className="text-2xl font-bold text-white">
            Doable
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4 text-white">
              Create a
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
                new password
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Choose a strong password to keep your account secure.
            </p>
          </div>

          {/* Password requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-slate-300">At least 8 characters long</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-slate-300">
                At least one uppercase letter
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-slate-300">At least one number</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-500">
          © 2026 Doable. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLeftSection;
