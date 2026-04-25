import {
  ArrowLeft,
  Calendar,
  Cog,
  DollarSign,
  MessageSquare,
  ShieldOff,
  User,
} from "lucide-react";
import Link from "next/link";

import getApplicationDetailsAction from "@/actions/application/getApplicationDetailsAction";
import { ApplicationOwnerActions } from "@/components/profile/tasks/ApplicationOwnerActions";
import { OwnerPendingReviewActions } from "@/components/profile/tasks/OwnerPendingReviewActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  params: Promise<{ taskId: string; applicationId: string }>;
}

export default async function TaskApplicationDetailPage({ params }: PageProps) {
  const { taskId, applicationId } = await params;
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
          <Link href={`/profile/tasks/${taskId}/applications`}>
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
        <Link href={`/profile/tasks/${taskId}/applications`}>
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

  return (
    <div className="space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          href={`/profile/tasks/${taskId}/applications`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Application Detail
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
                Applicant&apos;s Message
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

        {/* Right column — applicant + task poster */}
        <div className="space-y-4">
          {/* actions */}
          {(app.status === "PENDING" ||
            app.task.status === "PENDING_REVIEW") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Cog className="h-4 w-4 text-slate-500" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {app.status === "PENDING" && (
                  <ApplicationOwnerActions
                    applicationId={app.id}
                    applicantName={app.applicant.name}
                  />
                )}
                {app.task.status === "PENDING_REVIEW" && (
                  <OwnerPendingReviewActions
                    stacked={true}
                    taskId={app.task.id}
                    taskTitle={app.task.title}
                  />
                )}
              </CardContent>
            </Card>
          )}

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
                <Avatar className="h-10 w-10">
                  <AvatarImage src={app.applicant.image ?? undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                    {getInitials(app.applicant.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-800">
                  {app.applicant.name}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Task summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-sm text-slate-900">
                {app.task.title}
              </p>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {app.task.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
