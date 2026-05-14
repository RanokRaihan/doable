import type { Metadata } from "next";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import getWithdrawalRequestAction from "@/actions/withdrawal/getWithdrawalRequestAction";

export const metadata: Metadata = {
  title: "Withdrawal Request",
  description: "View the details and status of a withdrawal request.",
};
import { WithdrawalRequestDetail } from "@/components/profile/withdrawal/requests/WithdrawalRequestDetail";
import { requireAuth } from "@/lib/auth/requireAuth";
import { WithdrawalRequestResponse } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WithdrawalRequestDetailPage({ params }: PageProps) {
  await requireAuth();
  const { id } = await params;

  const result = await getWithdrawalRequestAction(id);

  if (!result.success) {
    const status = "statusCode" in result ? result.statusCode : 0;
    const isNotFound = status === 404 || status === 403;

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
            <p className="font-semibold text-sm">
              {isNotFound
                ? "Withdrawal request not found"
                : "Failed to load withdrawal request"}
            </p>
            <p className="text-sm mt-0.5 text-red-600">
              {"message" in result
                ? result.message
                : "An unexpected error occurred."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const request = (result as WithdrawalRequestResponse).data;

  return (
    <div className="space-y-6">
      <Link
        href="/profile/withdrawal/requests"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Requests
      </Link>
      <WithdrawalRequestDetail request={request} />
    </div>
  );
}
