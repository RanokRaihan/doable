import type { Metadata } from "next";
import getPaymentSessionAction from "@/actions/payment/getPaymentSessionAction";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment was cancelled. Return to your task to try again.",
};
import {
  FetchErrorState,
  ParticipantsSection,
  TaskCard,
  TransactionSummaryCard,
  resolveStatusRedirectUrl,
} from "@/components/profile/payments/paymentPageHelpers";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/lib/api/types";
import { PaymentSessionDetail, PaymentStatus } from "@/lib/types";
import { ArrowLeft, Ban, CreditCard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentCancelPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionToken =
    typeof params.sessionToken === "string" ? params.sessionToken : null;

  if (!sessionToken) {
    redirect("/profile/payments");
  }

  const result = await getPaymentSessionAction(sessionToken);

  if (!result.success) {
    return (
      <FetchErrorState
        message={
          "message" in result ? result.message : "An unexpected error occurred."
        }
      />
    );
  }

  const session = (result as ApiResponse<PaymentSessionDetail>).data;

  if (session.status !== PaymentStatus.CANCELLED) {
    redirect(
      resolveStatusRedirectUrl(
        session.status,
        sessionToken,
        session.task?.id ?? null,
      ),
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Hero */}
      <div className="text-center space-y-3 py-2">
        <Ban className="size-16 text-slate-400 mx-auto" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payment Cancelled
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            This payment was cancelled. You can try again from the task page.
          </p>
        </div>
      </div>

      <TransactionSummaryCard
        session={session}
        amountClassName="text-slate-700"
      />

      {session.task && <TaskCard task={session.task} />}

      <ParticipantsSection payer={session.payer} payee={session.payee} />

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/profile/payments">
            <ArrowLeft className="size-4" />
            Back to Payments
          </Link>
        </Button>
        {session.task && (
          <Button asChild>
            <Link href={`/profile/tasks/${session.task.id}/payment`}>
              <CreditCard className="size-4" />
              Try Again
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
