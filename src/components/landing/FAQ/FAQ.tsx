"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const posterFAQs = [
  {
    q: "What does it cost to post?",
    a: "Posting is free. You only pay the agreed amount when the task is complete, plus a small 5% service fee that keeps the lights on.",
  },
  {
    q: "How are helpers vetted?",
    a: "Every helper is ID-verified, and you can see their ratings, reviews, and completed task history before you pick anyone.",
  },
  {
    q: "What if no one applies?",
    a: "98% of tasks get at least one applicant within 2 hours. If yours doesn't, we'll suggest tweaks to your budget or timing — or refund any boost you bought.",
  },
  {
    q: "Can I cancel after picking someone?",
    a: "You can cancel free up until they arrive. After that, a small fee covers their travel time. Full details in our cancellation policy.",
  },
  {
    q: "Is my payment safe?",
    a: "Funds sit in escrow and only release when you confirm the task is done. If there's an issue, our team mediates within 24 hours.",
  },
];

const helperFAQs = [
  {
    q: "Do I need to pay anything to apply?",
    a: "Never. doable doesn't charge helpers — applying, messaging, and getting paid are all free.",
  },
  {
    q: "How fast do I get paid?",
    a: "Funds release the moment the poster confirms — typically within 5 minutes of finishing — and land in your bank within 1–2 business days.",
  },
  {
    q: "What if the poster ghosts me?",
    a: "If a poster doesn't confirm 24 hours after you mark a task complete, payment auto-releases. You're never on the hook for their delays.",
  },
  {
    q: "Can I choose my own price?",
    a: "Yes. When you apply, you can match the listed budget or suggest a different number with a quick note explaining why.",
  },
  {
    q: "Do I need special skills or a license?",
    a: "For most tasks, no — just be reliable. Some categories (like electrical or licensed trades) require uploading proof before you can apply.",
  },
];

function FAQColumn({
  title,
  subtitle,
  items,
  icon,
  iconStyle,
  accordionId,
}: {
  title: string;
  subtitle: string;
  items: { q: string; a: string }[];
  icon: React.ReactNode;
  iconStyle?: React.CSSProperties;
  accordionId: string;
}) {
  return (
    <div className="bg-white border border-ds-line rounded-3xl p-9">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-[10px] bg-ds-orange-soft text-ds-orange-ink flex items-center justify-center shrink-0"
          style={iconStyle}
        >
          {icon}
        </div>
        <h3 className="text-[20px] font-semibold text-ds-ink m-0 tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-[14px] text-ds-ink-2 mt-0 mb-6">{subtitle}</p>

      <Accordion type="single" collapsible defaultValue={`${accordionId}-0`}>
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`${accordionId}-${i}`}
            className={cn(
              "border-ds-line",
              i === items.length - 1 && "border-b border-ds-line",
            )}
          >
            <AccordionTrigger className="text-[15px] font-medium text-ds-ink tracking-tight py-4.5 hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-ds-ink-2 leading-relaxed pb-4.5">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 bg-ds-bg" id="faq">
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        {/* Header */}
        <div className="flex justify-between items-end gap-8 flex-wrap mb-12">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-ds-ink-3 mb-3.5">
              Common questions
            </div>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-tight text-ds-ink m-0"
              style={
                {
                  fontSize: "clamp(34px, 4vw, 52px)",
                  textWrap: "balance",
                } as React.CSSProperties
              }
            >
              Two sides, <em className="italic text-ds-orange">same answers</em>
              .
            </h2>
          </div>
          <p
            className="text-[17px] text-ds-ink-2 m-0"
            style={{ maxWidth: 480 }}
          >
            Whatever side of a task you&apos;re on, here&apos;s what folks ask
            the most before they sign up.
          </p>
        </div>

        {/* Two-column FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FAQColumn
            title="I'm posting a task"
            subtitle="Questions from people getting help."
            items={posterFAQs}
            accordionId="poster"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            }
          />
          <FAQColumn
            title="I'm applying for tasks"
            subtitle="Questions from people helping out."
            items={helperFAQs}
            accordionId="helper"
            iconStyle={{ background: "#e0e7ff", color: "#4338ca" }}
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
