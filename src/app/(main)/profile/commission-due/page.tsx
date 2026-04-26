import { AlertCircle } from "lucide-react";

import getCommissionsDueAction from "@/actions/wallet/getCommissionsDueAction";
import { CommissionsDueClient } from "./CommissionsDueClient";
import {
  CommissionDueSortField,
  CommissionsDueListResponse,
  SortOrder,
} from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CommissionDuePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const sortBy = (params.sortBy as CommissionDueSortField) || "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) || "desc";

  const result = await getCommissionsDueAction({ page, limit, sortBy, sortOrder });

  if (!result.success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Failed to load commission records</p>
          <p className="text-sm mt-0.5 text-red-600">
            {"message" in result ? result.message : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  const { data: commissions, meta } = (result as CommissionsDueListResponse).data;
  const currentFilters = { page, limit, sortBy, sortOrder };

  return (
    <CommissionsDueClient
      commissions={commissions}
      meta={meta}
      currentFilters={currentFilters}
    />
  );
}
