import { Wallet as WalletIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "@/lib/types";

interface WalletSummaryCardProps {
  wallet: Wallet;
}

export function WalletSummaryCard({ wallet }: WalletSummaryCardProps) {
  const createdDate = new Date(wallet.createdAt).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <WalletIcon className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">My Wallet</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="border-green-300 bg-green-50 text-green-700 font-medium"
          >
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white text-center">
          <p className="text-sm font-medium opacity-80">Available Balance</p>
          <p className="text-4xl font-bold mt-1">৳ {wallet.balance}</p>
          {wallet.user && (
            <p className="text-sm opacity-70 mt-2">{wallet.user.name}</p>
          )}
        </div>

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            <span className="text-slate-400">Wallet ID: </span>
            <span className="font-mono">{wallet.id.slice(0, 20)}…</span>
          </span>
          <span>Member since {createdDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
