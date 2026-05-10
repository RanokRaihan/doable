import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import getMyWalletAction from "@/actions/wallet/getMyWalletAction";
import getWithdrawalMethodsAction from "@/actions/withdrawal/getWithdrawalMethodsAction";
import { WithdrawalRequestForm } from "@/components/profile/withdrawal/requests/WithdrawalRequestForm";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/requireAuth";
import { MyWalletResponse, WithdrawalMethodsListResponse } from "@/lib/types";

export default async function NewWithdrawalRequestPage() {
  await requireAuth();

  const [methodsResult, walletResult] = await Promise.all([
    getWithdrawalMethodsAction({ limit: 100 }),
    getMyWalletAction(),
  ]);

  const methods = methodsResult.success
    ? (methodsResult as WithdrawalMethodsListResponse).data
    : [];

  const walletBalance = walletResult.success
    ? (walletResult as MyWalletResponse).data.balance
    : "0";

  return (
    <div className="space-y-6">
      <Link
        href="/profile/withdrawal/requests"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Requests
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Withdrawal</h1>
        <p className="text-sm text-slate-500 mt-1">
          Request a withdrawal from your wallet balance.
        </p>
      </div>

      {!walletResult.success && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Could not load wallet balance. Proceed with caution.</span>
        </div>
      )}

      {methods.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">
            No withdrawal methods available
          </p>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            You need to add a withdrawal method before making a request.
          </p>
          <Button asChild>
            <Link href="/profile/withdrawal/methods/new">
              Add Withdrawal Method
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <WithdrawalRequestForm
            mode="create"
            methods={methods}
            walletBalance={walletBalance}
          />
        </div>
      )}
    </div>
  );
}
