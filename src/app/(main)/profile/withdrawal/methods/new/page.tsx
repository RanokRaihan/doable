import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { WithdrawalMethodForm } from "@/components/profile/withdrawal/methods/WithdrawalMethodForm";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function NewWithdrawalMethodPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/profile/withdrawal/methods"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Methods
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Add Withdrawal Method
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a bank account or mobile banking account to receive withdrawals.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <WithdrawalMethodForm />
      </div>
    </div>
  );
}
