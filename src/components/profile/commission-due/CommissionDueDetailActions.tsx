"use client";

import { Receipt } from "lucide-react";
import { useState } from "react";

import { PayCommissionDueDialog } from "@/components/profile/commission-due/PayCommissionDueDialog";
import { Button } from "@/components/ui/button";

interface CommissionDueDetailActionsProps {
  dueId: string;
  amount: string;
}

export function CommissionDueDetailActions({
  dueId,
  amount,
}: CommissionDueDetailActionsProps) {
  const [payOpen, setPayOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
        onClick={() => setPayOpen(true)}
      >
        <Receipt className="h-4 w-4 mr-2" />
        Pay Now
      </Button>

      <PayCommissionDueDialog
        dueId={dueId}
        amount={amount}
        open={payOpen}
        onOpenChange={setPayOpen}
      />
    </>
  );
}
