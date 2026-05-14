import type { Metadata } from "next";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import getWithdrawalMethodAction from "@/actions/withdrawal/getWithdrawalMethodAction";

export const metadata: Metadata = {
  title: "Edit Withdrawal Method",
  description: "Update your bank or mobile banking withdrawal method.",
};
import { WithdrawalMethodEditForm } from "@/components/profile/withdrawal/methods/WithdrawalMethodEditForm";
import { requireAuth } from "@/lib/auth/requireAuth";
import { WithdrawalMethodResponse } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWithdrawalMethodPage({ params }: PageProps) {
  await requireAuth();
  const { id } = await params;

  const result = await getWithdrawalMethodAction(id);

  if (!result.success) {
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
            <p className="font-semibold text-sm">Failed to load withdrawal method</p>
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
        href={`/profile/withdrawal/methods/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Method
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Withdrawal Method
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Update the details for{" "}
          <span className="font-medium text-slate-700">{method.accountName}</span>.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <WithdrawalMethodEditForm
          methodId={id}
          defaultValues={method}
          redirectTo={`/profile/withdrawal/methods/${id}`}
        />
      </div>
    </div>
  );
}
