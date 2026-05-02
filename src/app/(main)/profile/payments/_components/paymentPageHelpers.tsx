import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PaymentMethod,
  PaymentSessionDetail,
  PaymentStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { CreditCard, ExternalLink, Receipt, User } from "lucide-react";
import Link from "next/link";

export function formatCurrency(amount: string) {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `৳ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function resolveStatusRedirectUrl(
  status: string,
  sessionToken: string,
  taskId: string | null,
): string {
  if (status === PaymentStatus.PENDING) {
    return taskId
      ? `/profile/tasks/${taskId}/payment`
      : "/profile/payments";
  }
  const routes: Record<string, string> = {
    [PaymentStatus.COMPLETED]: `/profile/payments/success?sessionToken=${sessionToken}`,
    [PaymentStatus.FAILED]: `/profile/payments/fail?sessionToken=${sessionToken}`,
    [PaymentStatus.CANCELLED]: `/profile/payments/cancel?sessionToken=${sessionToken}`,
    [PaymentStatus.REFUNDED]: `/profile/payments/refunded?sessionToken=${sessionToken}`,
  };
  return routes[status] ?? "/profile/payments";
}

export function StatusBadge({ status }: { status: string }) {
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

export function MethodBadge({ method }: { method: string }) {
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

export function DetailRow({
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

export function ParticipantCard({
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

export function TransactionSummaryCard({
  session,
  amountClassName = "text-slate-800",
}: {
  session: PaymentSessionDetail;
  amountClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-slate-500" />
          <CardTitle className="text-base">Transaction Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2 py-5">
          <p className={cn("text-4xl font-bold", amountClassName)}>
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
          <DetailRow label="Initiated">{formatDate(session.createdAt)}</DetailRow>
          {session.paidAt && (
            <DetailRow label="Paid At">{formatDate(session.paidAt)}</DetailRow>
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
  );
}

export function TaskCard({
  task,
}: {
  task: NonNullable<PaymentSessionDetail["task"]>;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="font-semibold text-slate-900 truncate">
              {task.title}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {task.category
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.status.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={`/tasks/${task.id}`}>
              <ExternalLink className="size-3.5" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ParticipantsSection({
  payer,
  payee,
}: {
  payer: PaymentSessionDetail["payer"];
  payee: PaymentSessionDetail["payee"];
}) {
  if (!payer && !payee) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {payer && <ParticipantCard label="Payer" user={payer} />}
      {payee && <ParticipantCard label="Worker" user={payee} />}
    </div>
  );
}

export function FetchErrorState({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        <div className="space-y-0.5">
          <p className="font-semibold text-sm">Could not load payment details</p>
          <p className="text-sm text-red-600">{message}</p>
        </div>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/profile/payments">Back to Payments</Link>
      </Button>
    </div>
  );
}
