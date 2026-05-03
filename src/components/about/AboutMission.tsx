import {
  AnimatedItem,
  AnimatedSection,
} from "@/components/howItWorks/AnimatedSection";
import { cn } from "@/lib/utils";
import { Banknote, Globe, Handshake, Target } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "The problem",
    body: "Hiring help for everyday tasks means endless Googling, cold calls, and blind trust. Earning extra cash means rigid schedules and faceless apps. Both sides deserve better.",
  },
  {
    icon: Globe,
    title: "The idea",
    body: "What if hiring and working lived on the same feed — like a social platform? Post a task, scroll for gigs, send offers, chat, and pay — all in one place, open to everyone.",
  },
  {
    icon: Handshake,
    title: "The approach",
    body: "We removed the middlemen. No job boards, no agency fees. Direct connections between neighbours, verified identities, and transparent pricing — cash or online.",
  },
  {
    icon: Banknote,
    title: "The result",
    body: "A marketplace where tasks fill in minutes, workers earn on their own terms, and payment is as flexible as the work itself. Thousands of tasks completed every week.",
  },
];

export const AboutMission = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto px-8" style={{ maxWidth: 1480 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            Our Mission
          </span>
          <h2
            className="mx-auto mt-4 max-w-3xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            We started because getting help shouldn&apos;t be this hard
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-ds-ink-2">
            Doable exists to make everyday tasks effortless — for the people
            posting them and the people doing them.
          </p>
        </AnimatedSection>

        <AnimatedSection stagger staggerDelay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((item) => (
              <AnimatedItem key={item.title} direction="up">
                <div
                  className={cn(
                    "group relative rounded-2xl border border-ds-line bg-white p-7",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  )}
                  style={{
                    boxShadow:
                      "0 1px 0 rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.04)",
                  }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ds-orange-soft text-ds-orange-ink transition-transform duration-300 group-hover:scale-110">
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 text-[16px] font-semibold text-ds-ink">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-ds-ink-3">
                    {item.body}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
