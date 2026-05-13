import { ArrowDownToLine } from "lucide-react";

import { WithdrawalTabNav } from "@/components/profile/withdrawal/WithdrawalTabNav";

export default function WithdrawalTabbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <ArrowDownToLine className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Withdrawal</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your withdrawal methods and requests
          </p>
        </div>
      </div>

      <WithdrawalTabNav />

      <div className="pt-4">{children}</div>
    </div>
  );
}
