"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Hash, MapPin, Route, User } from "lucide-react";
import { toast } from "sonner";

import createWithdrawalMethodAction from "@/actions/withdrawal/createWithdrawalMethodAction";
import updateWithdrawalMethodAction from "@/actions/withdrawal/updateWithdrawalMethodAction";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { WithdrawalMethod } from "@/lib/types";
import createWithdrawalMethodValidation, {
  CreateWithdrawalMethodFormData,
} from "@/schema/createWithdrawalMethodValidation";
import updateWithdrawalMethodValidation from "@/schema/updateWithdrawalMethodValidation";

interface WithdrawalMethodFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<WithdrawalMethod>;
  methodId?: string;
  redirectTo?: string;
}

export function WithdrawalMethodForm({
  mode,
  defaultValues,
  methodId,
  redirectTo,
}: WithdrawalMethodFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  const form = useAppForm({
    defaultValues: {
      methodType:
        (defaultValues?.methodType as "BANK" | "MOBILE_BANKING") ?? "BANK",
      accountName: defaultValues?.accountName ?? "",
      accountNumber: defaultValues?.accountNumber ?? "",
      bankName: defaultValues?.bankName ?? "",
      branchName: defaultValues?.branchName ?? "",
      routingNumber: defaultValues?.routingNumber ?? "",
      isDefault: false,
    },
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: (isEdit ? updateWithdrawalMethodValidation : createWithdrawalMethodValidation) as any,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      if (isEdit && methodId) {
        const payload: Record<string, unknown> = {};
        if (value.accountName) payload.accountName = value.accountName;
        if (value.accountNumber) payload.accountNumber = value.accountNumber;
        if (value.methodType) payload.methodType = value.methodType;
        if (value.bankName) payload.bankName = value.bankName;
        if (value.branchName) payload.branchName = value.branchName;
        if (value.routingNumber) payload.routingNumber = value.routingNumber;

        const result = await updateWithdrawalMethodAction(
          methodId,
          payload as Parameters<typeof updateWithdrawalMethodAction>[1],
        );

        if (result.success) {
          toast.success("Withdrawal method updated");
          router.push(redirectTo ?? `/profile/withdrawal/methods/${methodId}`);
        } else {
          setServerError(
            "message" in result ? result.message : "Update failed",
          );
        }
      } else {
        const payload: CreateWithdrawalMethodFormData = {
          methodType: value.methodType as "BANK" | "MOBILE_BANKING",
          accountName: value.accountName,
          accountNumber: value.accountNumber,
        };
        if (value.bankName) payload.bankName = value.bankName;
        if (value.branchName) payload.branchName = value.branchName;
        if (value.routingNumber) payload.routingNumber = value.routingNumber;
        if (value.isDefault) payload.isDefault = value.isDefault;

        const result = await createWithdrawalMethodAction(payload);

        if (result.success) {
          toast.success("Withdrawal method added");
          router.push(redirectTo ?? "/profile/withdrawal/methods");
        } else {
          setServerError(
            "message" in result ? result.message : "Creation failed",
          );
        }
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      {serverError && (
        <ServerErrorDisplay
          serverError={serverError}
          setServerError={setServerError}
        />
      )}

      <form.AppField
        name="methodType"
        children={(field) => (
          <field.SelectField
            label="Method Type"
            options={[
              { value: "BANK", label: "Bank Transfer" },
              { value: "MOBILE_BANKING", label: "Mobile Banking" },
            ]}
          />
        )}
      />

      <form.AppField
        name="accountName"
        children={(field) => (
          <field.InputWithIcon
            label="Account Name"
            icon={User}
            placeholder="Full account holder name"
          />
        )}
      />

      <form.AppField
        name="accountNumber"
        children={(field) => (
          <field.InputWithIcon
            label="Account Number"
            icon={Hash}
            placeholder="Account number"
          />
        )}
      />

      <form.Subscribe
        selector={(state) => state.values.methodType}
        children={(methodType) =>
          methodType === "BANK" ? (
            <>
              <form.AppField
                name="bankName"
                children={(field) => (
                  <field.InputWithIcon
                    label="Bank Name"
                    icon={Building2}
                    placeholder="e.g. Dutch-Bangla Bank"
                    description="Required for bank transfers"
                  />
                )}
              />
              <form.AppField
                name="branchName"
                children={(field) => (
                  <field.InputWithIcon
                    label="Branch Name"
                    icon={MapPin}
                    placeholder="e.g. Mirpur Branch (optional)"
                  />
                )}
              />
              <form.AppField
                name="routingNumber"
                children={(field) => (
                  <field.InputWithIcon
                    label="Routing Number"
                    icon={Route}
                    placeholder="9-digit routing number (optional)"
                  />
                )}
              />
            </>
          ) : null
        }
      />

      {!isEdit && (
        <form.AppField
          name="isDefault"
          children={(field) => (
            <field.Checkbox label="Set as default withdrawal method" />
          )}
        />
      )}

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Saving…"
                  : "Adding…"
                : isEdit
                  ? "Save Changes"
                  : "Add Method"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        )}
      />
    </form>
  );
}
