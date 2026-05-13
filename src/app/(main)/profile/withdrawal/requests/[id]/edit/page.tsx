import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import getMyWalletAction from "@/actions/wallet/getMyWalletAction";
import getWithdrawalMethodsAction from "@/actions/withdrawal/getWithdrawalMethodsAction";
import getWithdrawalRequestAction from "@/actions/withdrawal/getWithdrawalRequestAction";
import { WithdrawalRequestForm } from "@/components/profile/withdrawal/requests/WithdrawalRequestForm";
import { requireAuth } from "@/lib/auth/requireAuth";
import {
  MyWalletResponse,
  WithdrawalMethodsListResponse,
  WithdrawalRequestResponse,
} from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWithdrawalRequestPage({ params }: PageProps) {
  await requireAuth();
  const { id } = await params;

  const result = await getWithdrawalRequestAction(id);

  if (!result.success) {
    return (
      <div className="space-y-4">
        <Link
          href="/profile/withdrawal/requests"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Link>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Failed to load withdrawal request</p>
            <p className="text-sm mt-0.5 text-red-600">
              {"message" in result ? result.message : "An unexpected error occurred."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const request = (result as WithdrawalRequestResponse).data;

  if (request.status !== "PENDING") {
    return (
      <div className="space-y-4">
        <Link
          href={`/profile/withdrawal/requests/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Request
        </Link>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">
              This request can no longer be edited.
            </p>
            <p className="text-sm mt-0.5">
              Only PENDING requests can be edited. This request is{" "}
              <span className="font-medium">{request.status}</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        href={`/profile/withdrawal/requests/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Request
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Withdrawal</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update the amount or note for this withdrawal request.
        </p>
      </div>

      {!walletResult.success && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Could not load wallet balance.</span>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <WithdrawalRequestForm
          mode="edit"
          methods={methods}
          walletBalance={walletBalance}
          defaultValues={request}
          requestId={id}
          redirectTo={`/profile/withdrawal/requests/${id}`}
        />
      </div>
    </div>
  );
}
