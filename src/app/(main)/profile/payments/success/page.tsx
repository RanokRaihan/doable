import getPaymentSessionAction from "@/actions/payment/getPaymentSessionAction";
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
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
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

  if (session.status !== PaymentStatus.COMPLETED) {
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
        <CheckCircle2 className="size-16 text-emerald-500 mx-auto" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payment Successful
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your payment has been processed successfully.
          </p>
        </div>
      </div>

      <TransactionSummaryCard
        session={session}
        amountClassName="text-emerald-600"
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
            <Link href={`/profile/tasks/${session.task.id}`}>
              View Task
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
