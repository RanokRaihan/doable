import getPaymentSessionAction from "@/actions/payment/getPaymentSessionAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiResponse } from "@/lib/api/types";
import {
  PaymentMethod,
  PaymentSessionDetail,
  PaymentStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Receipt,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function formatCurrency(amount: string) {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `৳ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    [PaymentStatus.COMPLETED]:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
    [PaymentStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
    [PaymentStatus.FAILED]: "bg-red-100 text-red-700 border-red-200",
    [PaymentStatus.CANCELLED]: "bg-slate-100 text-slate-600 border-slate-200",
    [PaymentStatus.REFUNDED]: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        map[status] ?? "bg-slate-100 text-slate-600 border-slate-200",
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        method === PaymentMethod.ONLINE
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200",
      )}
    >
      <CreditCard className="size-3" />
      {method === PaymentMethod.ONLINE ? "Online" : "Cash"}
    </span>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 shrink-0">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-800 text-right">
        {children}
      </dd>
    </div>
  );
}

function ParticipantCard({
  label,
  user,
}: {
  label: string;
  user: { name: string; email: string };
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <User className="size-4 text-blue-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
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
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">
              Could not load payment details
            </p>
            <p className="text-sm mt-0.5 text-red-600">
              {"message" in result
                ? result.message
                : "An unexpected error occurred."}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile/payments">
            <ArrowLeft className="size-4" />
            Back to Payments
          </Link>
        </Button>
      </div>
    );
  }

  const session = (result as ApiResponse<PaymentSessionDetail>).data;
  console.log("Payment session details:", session); // Debug log
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

      {/* Transaction Summary */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-slate-500" />
            <CardTitle className="text-base">Transaction Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Amount + status — hero row */}
          <div className="flex flex-col items-center gap-2 py-5">
            <p className="text-4xl font-bold text-emerald-600">
              {formatCurrency(session.amount)}
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge status={session.status} />
              <MethodBadge method={session.method} />
            </div>
          </div>

          <Separator />

          <dl className="divide-y divide-slate-100 mt-1">
            <DetailRow label="Transaction ID">
              <span className="font-mono text-xs text-slate-600 break-all">
                {session.transactionId}
              </span>
            </DetailRow>
            <DetailRow label="Payment ID">
              <span className="font-mono text-xs text-slate-600 break-all">
                {session.id}
              </span>
            </DetailRow>
            <DetailRow label="Initiated">
              {formatDate(session.createdAt)}
            </DetailRow>
            {session.paidAt && (
              <DetailRow label="Paid At">
                {formatDate(session.paidAt)}
              </DetailRow>
            )}
            {session.failedAt && (
              <DetailRow label="Failed At">
                {formatDate(session.failedAt)}
              </DetailRow>
            )}
            {session.refundedAt && (
              <DetailRow label="Refunded At">
                {formatDate(session.refundedAt)}
              </DetailRow>
            )}
            {session.cashStatus && (
              <DetailRow label="Cash Status">
                <Badge variant="outline" className="text-xs">
                  {session.cashStatus.replace(/_/g, " ")}
                </Badge>
              </DetailRow>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Task Details */}
      {session.task && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="font-semibold text-slate-900 truncate">
                  {session.task.title}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {session.task.category
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {session.task.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href={`/tasks/${session.task.id}`}>
                  <ExternalLink className="size-3.5" />
                  View
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      {(session.payer || session.payee) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {session.payer && (
            <ParticipantCard label="Payer" user={session.payer} />
          )}
          {session.payee && (
            <ParticipantCard label="Worker" user={session.payee} />
          )}
        </div>
      )}

      {/* Session expiry note (only if still pending) */}
      {session.status === PaymentStatus.PENDING && session.sessionExpiresAt && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <Clock className="size-4 shrink-0 mt-0.5" />
          <p className="text-sm">
            Session expires at{" "}
            <span className="font-semibold">
              {formatDate(session.sessionExpiresAt)}
            </span>
          </p>
        </div>
      )}

      {/* CTAs */}
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
