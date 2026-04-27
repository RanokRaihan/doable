import { CreditCard } from "lucide-react";

import { PaymentsTabNav } from "@/components/profile/payments/PaymentsTabNav";

export default function PaymentsTabbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your payment history</p>
        </div>
      </div>

      <PaymentsTabNav />

      <div className="pt-4">{children}</div>
    </div>
  );
}
