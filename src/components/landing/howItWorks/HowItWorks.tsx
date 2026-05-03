"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const POSTER_STEPS = [
  {
    num: "01",
    title: "Describe your task",
    body: "Tell us what needs doing, when, and where. A photo helps. Most posts take under a minute to write.",
  },
  {
    num: "02",
    title: "Pick your helper",
    body: "Vetted neighbors apply with a short intro and their price. Compare ratings, pick the one that fits.",
  },
  {
    num: "03",
    title: "Pay when it's done",
    body: "Funds sit in escrow until you confirm. Tap done, leave a review, and you're set until next time.",
  },
];

const HELPER_STEPS = [
  {
    num: "01",
    title: "Find a task you're good at",
    body: "Filter by category, distance, and pay. New tasks drop every minute, so check back often.",
  },
  {
    num: "02",
    title: "Apply in 30 seconds",
    body: "Send a short intro and your price. Best fit wins — no bidding wars, no race-to-the-bottom.",
  },
  {
    num: "03",
    title: "Show up, get paid",
    body: "Do the task, mark it complete, get paid in minutes. Build a profile that lands you the next gig.",
  },
];

export default function HowItWorks() {
  const [mode, setMode] = useState<"poster" | "helper">("poster");
  const steps = mode === "poster" ? POSTER_STEPS : HELPER_STEPS;

  return (
    <section className="py-24 bg-ds-bg" id="how">
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        <div
          className="rounded-3xl px-7 py-14 md:px-16 md:py-20"
          style={{ background: "#0f172a", color: "#fafaf7" }}
        >
          {/* Header */}
          <div className="flex justify-between items-end gap-8 flex-wrap">
            <div>
              <div className="text-[12px] font-medium uppercase tracking-[0.18em] mb-3.5" style={{ color: "rgba(250,250,247,0.6)" }}>
                How it works
              </div>
              <h2
                className="font-serif font-normal leading-[1.05] tracking-tight m-0"
                style={{ fontSize: "clamp(34px, 4vw, 52px)", color: "#fafaf7", textWrap: "balance" } as React.CSSProperties}
              >
                One account.{" "}
                <em className="italic not-italic" style={{ color: "#fdba74" }}>Both sides</em>{" "}
                of the table.
              </h2>
            </div>
            {/* Tabs */}
            <div
              className="inline-flex p-1 rounded-full"
              style={{ background: "rgba(250,250,247,0.08)" }}
            >
              {(["poster", "helper"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={cn(
                    "px-[18px] py-2 rounded-full text-[13px] font-medium border-0 cursor-pointer transition-all",
                    mode === tab
                      ? "bg-[#fafaf7] text-ds-ink"
                      : "bg-transparent"
                  )}
                  style={mode !== tab ? { color: "rgba(250,250,247,0.7)" } : {}}
                >
                  {tab === "poster" ? "I'm posting" : "I'm helping"}
                </button>
              ))}
            </div>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {steps.map((step) => (
              <div
                key={step.num}
                className="border-t pt-6"
                style={{ borderColor: "rgba(250,250,247,0.18)" }}
              >
                <div
                  className="font-serif italic text-[56px] leading-none text-ds-orange mb-7"
                >
                  {step.num}
                </div>
                <h3 className="text-[20px] font-semibold leading-snug tracking-tight m-0 mb-2.5" style={{ color: "#fafaf7" }}>
                  {step.title}
                </h3>
                <p className="text-[15px] m-0 leading-relaxed" style={{ color: "rgba(250,250,247,0.7)" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
