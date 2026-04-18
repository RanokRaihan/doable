"use client";

import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApplicationStatusType, MyApplication } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ApplicationCard } from "./ApplicationCard";

type FilterTab = "ALL" | ApplicationStatusType;

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "ALL",       label: "All"       },
  { value: "PENDING",   label: "Pending"   },
  { value: "APPROVED",  label: "Approved"  },
  { value: "REJECTED",  label: "Rejected"  },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

interface ApplicationsClientProps {
  initialApplications: MyApplication[];
}

export function ApplicationsClient({ initialApplications }: ApplicationsClientProps) {
  const [applications, setApplications] = useState<MyApplication[]>(initialApplications);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const filtered =
    activeFilter === "ALL"
      ? applications
      : applications.filter((a) => a.status === activeFilter);

  const countFor = (tab: FilterTab) =>
    tab === "ALL"
      ? applications.length
      : applications.filter((a) => a.status === tab).length;

  const handleWithdraw = async (id: string) => {
    setWithdrawingId(id);
    // Placeholder until withdraw endpoint is confirmed
    toast.info("Withdraw functionality coming soon.");
    setWithdrawingId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {applications.length} application{applications.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
              activeFilter === tab.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                activeFilter === tab.value
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {countFor(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {/* List or empty state */}
      {filtered.length === 0 ? (
        activeFilter !== "ALL" ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <Search className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No {activeFilter.toLowerCase()} applications
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              You have no applications with this status.
            </p>
            <button
              onClick={() => setActiveFilter("ALL")}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              View all applications
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <FileText className="h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No applications yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Browse available tasks and apply to get started.
            </p>
            <Link href="/tasks">
              <Button className="mt-4">Browse Tasks</Button>
            </Link>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {filtered.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onWithdraw={handleWithdraw}
              isWithdrawing={withdrawingId === application.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
