import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Calendar,
  CreditCard,
  Hash,
  MapPin,
  Receipt,
  ShieldOff,
  User,
  Wrench,
} from "lucide-react";

import getPaymentDetailAction from "@/actions/payment/getPaymentDetailAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiResponse } from "@/lib/api/types";
import type { PaymentDetail, PaymentMethodType, PaymentStatusType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

function paymentStatusStyles(status: PaymentStatusType): string {
  switch (status) {
    case "COMPLETED":  return "border-green-300 bg-green-50 text-green-700";
    case "FAILED":     return "border-red-300 bg-red-50 text-red-700";
    case "PENDING":    return "border-amber-300 bg-amber-50 text-amber-700";
    case "CANCELLED":  return "border-slate-200 bg-slate-50 text-slate-600";
    case "REFUNDED":   return "border-blue-300 bg-blue-50 text-blue-700";
    default:           return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function methodStyles(method: PaymentMethodType): string {
  return method === "ONLINE"
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : "border-orange-200 bg-orange-50 text-orange-700";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function PaymentDetailPage({ params }: PageProps) {
  const { paymentId } = await params;
  const result = await getPaymentDetailAction(paymentId);

  if (!result.success) {
    const statusCode = "statusCode" in result ? result.statusCode : 500;
    const message    = "message" in result ? result.message : "Something went wrong";

    if (statusCode === 400 || statusCode === 403 || statusCode === 404) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ShieldOff className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
          <Link href="/profile/payments/payment-made">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Receipt className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
        <Link href="/profile/payments/payment-made">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payments
          </Button>
        </Link>
      </div>
    );
  }

  const payment = (result as ApiResponse<PaymentDetail>).data;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/profile/payments/payment-made"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">৳ {payment.amount}</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">ID: {payment.id}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn("text-sm font-medium px-3 py-1", paymentStatusStyles(payment.status))}
            >
              {payment.status}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-sm font-medium px-3 py-1", methodStyles(payment.method))}
            >
              {payment.method}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {payment.failedAt && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Payment Failed</p>
                    {payment.failureReason && (
                      <p className="text-xs mt-0.5 text-red-600">{payment.failureReason}</p>
                    )}
                    <p className="text-xs mt-0.5 text-red-500">{formatDate(payment.failedAt)}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Amount</p>
                  <p className="font-semibold text-slate-900">৳ {payment.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Method</p>
                  <p className="text-slate-700">{payment.method}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <p
                    className={cn(
                      "font-semibold",
                      payment.status === "COMPLETED" ? "text-green-700" :
                      payment.status === "FAILED"    ? "text-red-700"   :
                      payment.status === "PENDING"   ? "text-amber-700" :
                                                       "text-slate-600",
                    )}
                  >
                    {payment.status}
                  </p>
                </div>
                {payment.cashStatus && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Cash Status</p>
                    <p className="text-slate-700">{payment.cashStatus}</p>
                  </div>
                )}
                {payment.paidAt && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Paid At</p>
                    <p className="text-slate-700">{formatDate(payment.paidAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Created At</p>
                  <p className="text-slate-700">{formatDate(payment.createdAt)}</p>
                </div>
                {payment.commissionDeducted && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Commission</p>
                    <p className="font-medium text-indigo-700">৳ {payment.commissionAmount} deducted</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-50 pt-3">
                <p className="text-xs text-slate-400 mb-0.5">Transaction ID</p>
                <p className="font-mono text-xs text-slate-600 break-all">
                  {payment.transactionId}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                Task Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-semibold text-slate-900">{payment.task.title}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Category</p>
                  <p className="text-slate-700">{payment.task.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <p className="text-slate-700">{payment.task.status}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <p className="text-xs leading-relaxed">{payment.task.location}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Payer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <p className="font-medium text-slate-900">{payment.payer.name}</p>
              <p className="text-slate-500 text-xs">{payment.payer.email}</p>
              <p className="font-mono text-xs text-slate-400 break-all">{payment.payer.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-blue-500" />
                Payee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <p className="font-medium text-slate-900">{payment.payee.name}</p>
              <p className="text-slate-500 text-xs">{payment.payee.email}</p>
              <p className="font-mono text-xs text-slate-400 break-all">{payment.payee.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono text-slate-500">
              <div>
                <p className="text-slate-400 mb-0.5 not-italic font-sans">Payment ID</p>
                <p className="break-all">{payment.id}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5 not-italic font-sans">Transaction ID</p>
                <p className="break-all">{payment.transactionId}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(payment.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
