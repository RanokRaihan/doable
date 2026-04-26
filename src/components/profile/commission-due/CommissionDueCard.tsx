"use client";

import Link from "next/link";
import { ExternalLink, MoreVertical, Receipt } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommissionDue, CommissionDueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PayCommissionDueDialog } from "./PayCommissionDueDialog";

interface CommissionDueCardProps {
  due: CommissionDue;
}

export function CommissionDueCard({ due }: CommissionDueCardProps) {
  const [payOpen, setPayOpen] = useState(false);
  const isDue = due.status === CommissionDueStatus.DUE;

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md hover:border-slate-200 transition-all">
        <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Receipt className="h-6 w-6 text-indigo-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-slate-900">৳ {due.amount}</p>
          <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
            Task: {due.taskId}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(due.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium",
              isDue
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-green-300 bg-green-50 text-green-700",
            )}
          >
            {isDue ? "Due" : "Paid"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isDue && (
                <DropdownMenuItem onSelect={() => setPayOpen(true)}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Pay Now
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/profile/commission-due/${due.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <PayCommissionDueDialog
        dueId={due.id}
        amount={due.amount}
        open={payOpen}
        onOpenChange={setPayOpen}
      />
    </>
  );
}
