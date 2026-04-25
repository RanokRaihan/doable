import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, MapPin, User } from "lucide-react";

import getApplicationDetailsAction from "@/actions/application/getApplicationDetailsAction";
import { getMyPostedTaskAction } from "@/actions/task/taskAction";
import { PaymentMethodSelector } from "@/components/profile/tasks/PaymentMethodSelector";
import { TaskBadges } from "@/components/tasks/detail/TaskBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function PaymentPage({ params }: Props) {
  const { taskId } = await params;

  const taskResult = await getMyPostedTaskAction(taskId);

  if (!taskResult.success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-red-200 bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <h2 className="text-base font-semibold text-red-700">
          {taskResult.statusCode === 404 ? "Task not found" : "Failed to load task"}
        </h2>
        <p className="text-sm text-red-600 mt-1 max-w-xs">
          {taskResult.message ?? "Something went wrong. Please try again."}
        </p>
        <Link href="/profile/tasks">
          <Button variant="outline" className="mt-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to My Tasks
          </Button>
        </Link>
      </div>
    );
  }

  const task = taskResult.data;

  if (task.status !== "PAYMENT_PROCESSING") {
    redirect(`/profile/tasks/${taskId}`);
  }

  if (!task.approvedApplicationId) {
    redirect(`/profile/tasks/${taskId}`);
  }

  const appResult = await getApplicationDetailsAction(task.approvedApplicationId);

  if (!appResult.success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-red-200 bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <h2 className="text-base font-semibold text-red-700">
          Failed to load worker details
        </h2>
        <p className="text-sm text-red-600 mt-1 max-w-xs">
          {appResult.message ?? "Something went wrong. Please try again."}
        </p>
        <Link href={`/profile/tasks/${taskId}`}>
          <Button variant="outline" className="mt-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Task
          </Button>
        </Link>
      </div>
    );
  }

  const application = appResult.data;
  const compensation = task.agreedCompensation ?? task.baseCompensation;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
        <Link href={`/profile/tasks/${taskId}`}>
          <ArrowLeft className="w-4 h-4" />
          Back to Task
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete payment for your approved task.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Task summary */}
          <Card>
            <CardHeader className="pb-3">
              <TaskBadges
                status={task.status}
                priority={task.priority}
                category={task.category}
              />
              <CardTitle className="text-xl font-bold text-gray-900 mt-3">
                {task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-slate-600 pt-1">{task.location}</p>
              </div>
              {task.description && (
                <>
                  <Separator />
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {task.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Worker details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-700">
                Worker Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {application.applicant.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={application.applicant.image}
                      alt={application.applicant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {application.applicant.name}
                  </p>
                  <p className="text-xs text-slate-400">Approved Worker</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Agreed Compensation</span>
                <span className="font-semibold text-emerald-700">
                  ৳{" "}
                  {parseFloat(compensation).toLocaleString("en-BD", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Application Status</span>
                <span className="font-medium text-slate-700 capitalize">
                  {application.status.toLowerCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment selector — sticky sidebar */}
        <div className="lg:sticky lg:top-6 self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-700">
                Choose Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodSelector
                taskId={taskId}
                agreedCompensation={compensation}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
