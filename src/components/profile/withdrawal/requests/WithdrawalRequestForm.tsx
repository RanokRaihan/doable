"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import createWithdrawalRequestAction from "@/actions/withdrawal/createWithdrawalRequestAction";
import editWithdrawalRequestAction from "@/actions/withdrawal/editWithdrawalRequestAction";
import ServerErrorDisplay from "@/components/form/ServerErrorDisplay";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { WithdrawalMethod, WithdrawalRequestWithMethod } from "@/lib/types";
import createWithdrawalRequestValidation from "@/schema/createWithdrawalRequestValidation";
import editWithdrawalRequestValidation from "@/schema/editWithdrawalRequestValidation";

interface WithdrawalRequestFormProps {
  mode: "create" | "edit";
  methods: WithdrawalMethod[];
  walletBalance: string;
  defaultValues?: Partial<WithdrawalRequestWithMethod>;
  requestId?: string;
  redirectTo?: string;
}

function formatAmount(amount: string) {
  const num = parseFloat(amount);
  return `৳ ${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function WithdrawalRequestForm({
  mode,
  methods,
  walletBalance,
  defaultValues,
  requestId,
  redirectTo,
}: WithdrawalRequestFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  const defaultMethod = methods.find((m) => m.isDefault) ?? methods[0];

  const methodOptions = methods.map((m) => {
    const masked =
      m.accountNumber.length > 4
        ? `••••${m.accountNumber.slice(-4)}`
        : m.accountNumber;
    const typeLabel = m.methodType === "BANK" ? "Bank" : "Mobile";
    return {
      value: m.id,
      label: `${m.accountName} — ${typeLabel} ${masked}`,
    };
  });

  const form = useAppForm({
    defaultValues: {
      withdrawalMethodId:
        defaultValues?.withdrawalMethodId ?? defaultMethod?.id ?? "",
      amount: defaultValues?.amount ? parseFloat(defaultValues.amount) : (0 as number),
      note: defaultValues?.note ?? "",
    },
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: (isEdit ? editWithdrawalRequestValidation : createWithdrawalRequestValidation) as any,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      if (isEdit && requestId) {
        const payload: { amount?: number; note?: string } = {};
        if (value.amount) payload.amount = value.amount;
        if (value.note !== undefined) payload.note = value.note;

        const result = await editWithdrawalRequestAction(requestId, payload);

        if (result.success) {
          toast.success("Withdrawal request updated");
          router.push(
            redirectTo ?? `/profile/withdrawal/requests/${requestId}`,
          );
        } else {
          setServerError(
            "message" in result ? result.message : "Update failed",
          );
        }
      } else {
        const result = await createWithdrawalRequestAction({
          withdrawalMethodId: value.withdrawalMethodId,
          amount: value.amount,
          note: value.note || undefined,
        });

        if (result.success) {
          toast.success("Withdrawal request created");
          router.push(redirectTo ?? "/profile/withdrawal/requests");
        } else {
          setServerError(
            "message" in result ? result.message : "Request failed",
          );
        }
      }
    },
  });

  const balance = parseFloat(walletBalance);
  const balanceFormatted = `৳ ${balance.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

      {!isEdit && (
        <form.AppField
          name="withdrawalMethodId"
          children={(field) => (
            <field.SelectField
              label="Withdrawal Method"
              options={methodOptions}
              placeholder="Select withdrawal method"
            />
          )}
        />
      )}

      <form.AppField
        name="amount"
        children={(field) => (
          <field.NumberInputField
            label="Amount"
            description={`Available balance: ${balanceFormatted}`}
            placeholder="Enter amount (min ৳10)"
          />
        )}
      />

      <form.AppField
        name="note"
        children={(field) => (
          <field.TextAreaField
            label="Note"
            description="Optional note about this withdrawal"
            placeholder="Any notes about this withdrawal request…"
          />
        )}
      />

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Saving…"
                  : "Submitting…"
                : isEdit
                  ? "Save Changes"
                  : "Submit Request"}
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
