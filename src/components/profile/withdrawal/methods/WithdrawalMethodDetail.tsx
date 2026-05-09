"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Edit,
  Hash,
  MapPin,
  Route,
  Smartphone,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import setDefaultWithdrawalMethodAction from "@/actions/withdrawal/setDefaultWithdrawalMethodAction";
import { DeleteWithdrawalMethodDialog } from "@/components/profile/withdrawal/methods/DeleteWithdrawalMethodDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WithdrawalMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WithdrawalMethodDetailProps {
  method: WithdrawalMethod;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function WithdrawalMethodDetail({
  method,
}: WithdrawalMethodDetailProps) {
  const router = useRouter();
  const isBank = method.methodType === "BANK";

  const handleSetDefault = async () => {
    const result = await setDefaultWithdrawalMethodAction(method.id);
    if (result.success) {
      toast.success("Default method updated");
      router.refresh();
    } else {
      toast.error(
        "message" in result ? result.message : "Failed to update default",
      );
    }
  };

  const createdAt = new Date(method.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedAt = new Date(method.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              isBank ? "bg-blue-100" : "bg-violet-100",
            )}
          >
            {isBank ? (
              <Building2 className="h-6 w-6 text-blue-600" />
            ) : (
              <Smartphone className="h-6 w-6 text-violet-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge
                variant="outline"
                className={cn(
                  isBank
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-violet-200 bg-violet-50 text-violet-700",
                )}
              >
                {isBank ? "Bank Transfer" : "Mobile Banking"}
              </Badge>
              {method.isDefault && (
                <Badge
                  variant="outline"
                  className="border-green-300 bg-green-50 text-green-700"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Default
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {method.accountName}
            </h2>
            <p className="text-sm font-mono text-slate-500 mt-1">
              {method.accountNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Account Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={User} label="Account Name" value={method.accountName} />
          <InfoRow icon={Hash} label="Account Number" value={method.accountNumber} />
          {isBank && method.bankName && (
            <InfoRow icon={Building2} label="Bank Name" value={method.bankName} />
          )}
          {isBank && method.branchName && (
            <InfoRow icon={MapPin} label="Branch" value={method.branchName} />
          )}
          {isBank && method.routingNumber && (
            <InfoRow
              icon={Route}
              label="Routing Number"
              value={method.routingNumber}
            />
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
          Timestamps
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={Calendar} label="Created" value={createdAt} />
          <InfoRow icon={Calendar} label="Last Updated" value={updatedAt} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {!method.isDefault && (
          <Button variant="outline" onClick={handleSetDefault} className="gap-2">
            <Star className="h-4 w-4" />
            Set as Default
          </Button>
        )}
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/profile/withdrawal/methods/${method.id}/edit`}>
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-8 hidden sm:block" />
        <DeleteWithdrawalMethodDialog
          methodId={method.id}
          accountName={method.accountName}
          accountNumber={method.accountNumber}
        >
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DeleteWithdrawalMethodDialog>
      </div>
    </div>
  );
}
