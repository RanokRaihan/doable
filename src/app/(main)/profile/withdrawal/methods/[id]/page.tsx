import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import getWithdrawalMethodAction from "@/actions/withdrawal/getWithdrawalMethodAction";
import { WithdrawalMethodDetail } from "@/components/profile/withdrawal/methods/WithdrawalMethodDetail";
import { requireAuth } from "@/lib/auth/requireAuth";
import { WithdrawalMethodResponse } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WithdrawalMethodDetailPage({ params }: PageProps) {
  await requireAuth();
  const { id } = await params;

  const result = await getWithdrawalMethodAction(id);

  if (!result.success) {
    const status = "statusCode" in result ? result.statusCode : 0;
    const isNotFound = status === 404 || status === 403;

    return (
      <div className="space-y-4">
        <Link
          href="/profile/withdrawal/methods"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Methods
        </Link>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">
              {isNotFound
                ? "Withdrawal method not found"
                : "Failed to load withdrawal method"}
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

  const method = (result as WithdrawalMethodResponse).data;

  return (
    <div className="space-y-6">
      <Link
        href="/profile/withdrawal/methods"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Methods
      </Link>
      <WithdrawalMethodDetail method={method} />
    </div>
  );
}
