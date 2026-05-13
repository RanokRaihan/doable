"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Hash, MapPin, Route, User } from "lucide-react";
import { toast } from "sonner";

import createWithdrawalMethodAction from "@/actions/withdrawal/createWithdrawalMethodAction";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import createWithdrawalMethodValidation from "@/schema/createWithdrawalMethodValidation";

export function WithdrawalMethodForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      methodType: "BANK" as "BANK" | "MOBILE_BANKING",
      accountName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      routingNumber: "",
      isDefault: false,
    },
    validators: { onSubmit: createWithdrawalMethodValidation },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const result = await createWithdrawalMethodAction({
        methodType: value.methodType,
        accountName: value.accountName,
        accountNumber: value.accountNumber,
        bankName: value.bankName,
        branchName: value.branchName,
        routingNumber: value.routingNumber,
        isDefault: value.isDefault,
      });

      if (result.success) {
        toast.success("Withdrawal method added");
        router.push("/profile/withdrawal/methods");
      } else {
        setServerError("message" in result ? result.message : "Creation failed");
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

        <form.AppField name="isDefault">
          {(field) => (
            <field.Checkbox label="Set as default withdrawal method" />
          )}
        </form.AppField>

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
                {isSubmitting ? "Adding…" : "Add Method"}
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
