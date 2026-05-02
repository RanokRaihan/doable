import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  Clock,
  Hash,
  Receipt,
  ShieldOff,
  User,
  Wrench,
} from "lucide-react";

import getCommissionDueAction from "@/actions/wallet/getCommissionDueAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommissionDueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CommissionDueDetailActions } from "@/components/profile/commission-due/CommissionDueDetailActions";

interface PageProps {
  params: Promise<{ dueId: string }>;
}

export default async function CommissionDueDetailPage({ params }: PageProps) {
  const { dueId } = await params;
  const result = await getCommissionDueAction(dueId);

  if (!result.success) {
    const statusCode = "statusCode" in result ? result.statusCode : 500;
    const message = "message" in result ? result.message : "Something went wrong";

    if (statusCode === 400 || statusCode === 403) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ShieldOff className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
          <Link href="/profile/commission-due">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Commission Due
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
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
        <Link href="/profile/commission-due">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Commission Due
          </Button>
        </Link>
      </div>
    );
  }

  const due = result.data;
  const isDue = due.status === CommissionDueStatus.DUE;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/profile/commission-due"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Commission Due
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Commission ৳ {due.amount}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">ID: {due.id}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="outline"
              className={cn(
                "text-sm font-medium px-3 py-1",
                isDue
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-green-300 bg-green-50 text-green-700",
              )}
            >
              {isDue ? "Due" : "Paid"}
            </Badge>
            {isDue && <CommissionDueDetailActions dueId={due.id} amount={due.amount} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-indigo-500" />
                Commission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Amount</p>
                  <p className="font-semibold text-slate-900">৳ {due.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <p
                    className={cn(
                      "font-semibold",
                      isDue ? "text-amber-700" : "text-green-700",
                    )}
                  >
                    {isDue ? "Due" : "Paid"}
                  </p>
                </div>
                {due.paidAt && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Paid At</p>
                    <p className="text-slate-700">
                      {new Date(due.paidAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                )}
                {due.paidViaPayment && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Payment ID</p>
                    <p className="font-mono text-xs text-slate-600 truncate">
                      {due.paidViaPayment}
                    </p>
                  </div>
                )}
                {due.paidViaTxn && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Transaction</p>
                    <p className="font-mono text-xs text-slate-600 truncate">
                      {due.paidViaTxn}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created{" "}
                  {new Date(due.createdAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated{" "}
                  {new Date(due.updatedAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </span>
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
              <div>
                <p className="font-semibold text-slate-900">{due.task.title}</p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {due.task.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Category</p>
                  <p className="text-slate-700">{due.task.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Status</p>
                  <p className="text-slate-700">{due.task.status}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Base Compensation</p>
                  <p className="text-slate-700">৳ {due.task.baseCompensation}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Agreed Compensation</p>
                  <p className="font-semibold text-slate-900">
                    ৳ {due.task.agreedCompensation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Posted By
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-slate-900">{due.task.postedBy.name}</p>
              <p className="text-slate-500 text-xs">{due.task.postedBy.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-blue-500" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Balance</p>
                <p className="font-semibold text-slate-900">৳ {due.wallet.balance}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Wallet ID</p>
                <p className="font-mono text-xs text-slate-500 break-all">
                  {due.wallet.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono text-slate-500">
              <div>
                <p className="text-slate-400 mb-0.5">Task ID</p>
                <p className="break-all">{due.taskId}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5">Wallet ID</p>
                <p className="break-all">{due.walletId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
