"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Hash, MapPin, Route, User } from "lucide-react";
import { toast } from "sonner";

import updateWithdrawalMethodAction from "@/actions/withdrawal/updateWithdrawalMethodAction";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { WithdrawalMethod } from "@/lib/types";
import updateWithdrawalMethodValidation from "@/schema/updateWithdrawalMethodValidation";

interface WithdrawalMethodEditFormProps {
  methodId: string;
  defaultValues: WithdrawalMethod;
  redirectTo?: string;
}

export function WithdrawalMethodEditForm({
  methodId,
  defaultValues,
  redirectTo,
}: WithdrawalMethodEditFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      methodType: defaultValues.methodType as "BANK" | "MOBILE_BANKING",
      accountName: defaultValues.accountName,
      accountNumber: defaultValues.accountNumber,
      bankName: defaultValues.bankName ?? "",
      branchName: defaultValues.branchName ?? "",
      routingNumber: defaultValues.routingNumber ?? "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onSubmit: updateWithdrawalMethodValidation as any },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const result = await updateWithdrawalMethodAction(methodId, {
        methodType: value.methodType,
        accountName: value.accountName,
        accountNumber: value.accountNumber,
        bankName: value.bankName,
        branchName: value.branchName,
        routingNumber: value.routingNumber,
      });

      if (result.success) {
        toast.success("Withdrawal method updated");
        router.push(redirectTo ?? `/profile/withdrawal/methods/${methodId}`);
      } else {
        setServerError("message" in result ? result.message : "Update failed");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="methodType">
          {(field) => (
            <field.SelectField
              label="Method Type"
              options={[
                { value: "BANK", label: "Bank Transfer" },
                { value: "MOBILE_BANKING", label: "Mobile Banking" },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="accountName">
          {(field) => (
            <field.InputWithIcon
              label="Account Name"
              icon={User}
              placeholder="Full account holder name"
            />
          )}
        </form.AppField>

        <form.AppField name="accountNumber">
          {(field) => (
            <field.InputWithIcon
              label="Account Number"
              icon={Hash}
              placeholder="Account number"
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.methodType}>
          {(methodType) => (
            <>
              <form.AppField name="bankName">
                {(field) => (
                  <field.InputWithIcon
                    label="Bank Name"
                    icon={Building2}
                    placeholder={
                      methodType === "BANK" ? "e.g. Dutch-Bangla Bank" : "e.g. Bkash"
                    }
                  />
                )}
              </form.AppField>

              <div className={cn(methodType !== "BANK" && "hidden")}>
                <form.AppField name="branchName">
                  {(field) => (
                    <field.InputWithIcon
                      label="Branch Name"
                      icon={MapPin}
                      placeholder="e.g. Mirpur Branch (optional)"
                    />
                  )}
                </form.AppField>
                <form.AppField name="routingNumber">
                  {(field) => (
                    <field.InputWithIcon
                      label="Routing Number"
                      icon={Route}
                      placeholder="9-digit routing number (optional)"
                    />
                  )}
                </form.AppField>
              </div>
            </>
          )}
        </form.Subscribe>

        {serverError && (
          <ServerErrorDisplay
            serverError={serverError}
            setServerError={setServerError}
          />
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save Changes"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
