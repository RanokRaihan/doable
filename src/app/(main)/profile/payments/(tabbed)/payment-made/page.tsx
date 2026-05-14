import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import getPaymentsMadeAction from "@/actions/payment/getPaymentsMadeAction";

export const metadata: Metadata = {
  title: "Payments Made",
  description: "View all payments you have made for completed tasks.",
};
import { PaymentsMadeClient } from "@/components/profile/payments/PaymentsMadeClient";
import type {
  PaymentMethodType,
  PaymentSortField,
  PaymentsMadeListResponse,
  PaymentStatusType,
  SortOrder,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsMadePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page      = Number(params.page) || 1;
  const limit     = Number(params.limit) || 10;
  const sortBy    = (params.sortBy as PaymentSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const rawMethod = typeof params.method === "string" ? params.method : undefined;
  const method: PaymentMethodType | undefined =
    rawMethod === "CASH" || rawMethod === "ONLINE" ? rawMethod : undefined;

  const rawStatus = typeof params.status === "string" ? params.status : undefined;
  const validStatuses = ["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"] as const;
  const status: PaymentStatusType | undefined = validStatuses.includes(rawStatus as PaymentStatusType)
    ? (rawStatus as PaymentStatusType)
    : undefined;

  const result = await getPaymentsMadeAction({ page, limit, sortBy, sortOrder, method, status });

  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load payments</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in result ? result.message : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const { data: payments, meta } = (result as PaymentsMadeListResponse).data;

  return (
    <PaymentsMadeClient
      payments={payments}
      meta={meta}
      currentFilters={{ page, limit, sortBy, sortOrder, method, status }}
    />
  );
}
