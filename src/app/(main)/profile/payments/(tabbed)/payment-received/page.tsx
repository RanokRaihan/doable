import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import getPaymentsReceivedAction from "@/actions/payment/getPaymentsReceivedAction";

export const metadata: Metadata = {
  title: "Payments Received",
  description: "View all payments you have received for completed tasks.",
};
import { PaymentsReceivedClient } from "@/components/profile/payments/PaymentsReceivedClient";
import type {
  PaymentMethodType,
  PaymentSortField,
  PaymentsReceivedListResponse,
  SortOrder,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsReceivedPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page      = Number(params.page) || 1;
  const limit     = Number(params.limit) || 10;
  const sortBy    = (params.sortBy as PaymentSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";
  const rawMethod = typeof params.method === "string" ? params.method : undefined;
  const method: PaymentMethodType | undefined =
    rawMethod === "CASH" || rawMethod === "ONLINE" ? rawMethod : undefined;

  const result = await getPaymentsReceivedAction({ page, limit, sortBy, sortOrder, method });

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

  const { data: payments, meta } = (result as PaymentsReceivedListResponse).data;

  return (
    <PaymentsReceivedClient
      payments={payments}
      meta={meta}
      currentFilters={{ page, limit, sortBy, sortOrder, method }}
    />
  );
}
