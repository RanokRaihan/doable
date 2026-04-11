import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { KeyRound } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    <div className="max-w-xl">
      {/* Page header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <KeyRound className="size-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Change Password</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
