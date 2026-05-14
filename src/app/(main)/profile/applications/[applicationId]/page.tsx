import type { Metadata } from "next";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  CreditCard,
  DollarSign,
  ExternalLink,
  MessageSquare,
  ShieldOff,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Application",
  description: "View the details of your task application and available actions.",
};
import Link from "next/link";

import getApplicationDetailsAction from "@/actions/application/getApplicationDetailsAction";
import { ApplicationDetailActions } from "@/components/profile/applications/ApplicationDetailActions";
import { CashPaymentActions } from "@/components/profile/applications/CashPaymentActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { taskStatusConfig } from "@/lib/taskStatusConfig";
import { ApplicationStatusType } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ApplicationStatusType,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100   text-red-700   border-red-200",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-gray-100  text-gray-600  border-gray-200",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { applicationId } = await params;
  const result = await getApplicationDetailsAction(applicationId);

  if (!result.success) {
    const statusCode = "statusCode" in result ? result.statusCode : 500;
    const message =
      "message" in result ? result.message : "Something went wrong";

    if (statusCode === 400 || statusCode === 403) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ShieldOff className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
          <Link href="/profile/applications">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
        <Link href="/profile/applications">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  const app = result.data;
  const appStatus = statusConfig[app.status];
  const taskStatus = taskStatusConfig[app.task.status];

  return (
    <div className="space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          href="/profile/applications"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {app.task.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              ID: {app.id}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="outline"
              className={cn(
                "text-sm font-medium px-3 py-1",
                appStatus.className,
              )}
            >
              {appStatus.label}
            </Badge>
            <ApplicationDetailActions
              taskId={app.task.id}
              taskTitle={app.task.title}
              applicationStatus={app.status}
              taskStatus={app.task.status}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — application details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Message */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Your Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {app.message}
              </p>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Proposed Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                ${app.proposedCompensation}
              </p>
            </CardContent>
          </Card>

          {/* Rejection / Withdrawal reason */}
          {app.rejectionReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-red-700">
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 leading-relaxed">
                  {app.rejectionReason}
                </p>
              </CardContent>
            </Card>
          )}

          {app.withdrawalReason && (
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600">
                  Withdrawal Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {app.withdrawalReason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Applied on</span>
                <span className="font-medium text-slate-800">
                  {formatDate(app.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last updated</span>
                <span className="font-medium text-slate-800">
                  {formatDate(app.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — payment + task + people */}
        <div className="space-y-4">
          {/* Payment card — only when payments are present */}
          {app.task.payments &&
            app.task.payments.length > 0 &&
            (() => {
              const payment = app.task.payments![0];
              const isCash = payment.method === "CASH";
              return (
                <Card
                  className={isCash ? "border-amber-200" : "border-blue-200"}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      {isCash ? (
                        <Banknote className="h-4 w-4 text-amber-500" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-blue-500" />
                      )}
                      {isCash ? "Cash Payment" : "Online Payment"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isCash ? (
                      <CashPaymentActions payment={payment} />
                    ) : (
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Amount</span>
                          <span className="font-bold text-slate-900">
                            ৳{" "}
                            {parseFloat(payment.amount).toLocaleString(
                              "en-BD",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Status</span>
                          <Badge
                            variant="outline"
                            className={
                              payment.status === "COMPLETED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : payment.status === "FAILED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {payment.status.charAt(0) +
                              payment.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Transaction</span>
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {payment.transactionId.slice(0, 16)}…
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

          {/* Task info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Link
                  href={`/tasks/${app.task.id}`}
                  className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {app.task.title}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </Link>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                  {app.task.description}
                </p>
              </div>
              {app.task.status && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    taskStatus?.className ??
                      "bg-slate-100 text-slate-600 border-slate-200",
                  )}
                >
                  {taskStatus?.label ?? app.task.status}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Posted by */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                Posted By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={app.task.postedBy.image ?? undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                    {getInitials(app.task.postedBy.name)}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href={`/users/${app.task.postedBy.id}`}
                  className="text-sm font-medium text-slate-800"
                >
                  {app.task.postedBy.name}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Applicant */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                Applicant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={app.applicant.image ?? undefined} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-xs font-semibold">
                    {getInitials(app.applicant.name)}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href={`/users/${app.applicant.id}`}
                  className="text-sm font-medium text-slate-800"
                >
                  {app.applicant.name}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
