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
    accent: "text-rose-600 bg-rose-50",
    shadow: "shadow-rose-500/10 hover:shadow-rose-500/20",
    border: "hover:border-rose-200",
  },
  {
    icon: Globe,
    title: "The idea",
    body: "What if hiring and working lived on the same feed — like a social platform? Post a task, scroll for gigs, send offers, chat, and pay — all in one place, open to everyone.",
    accent: "text-blue-600 bg-blue-50",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/20",
    border: "hover:border-blue-200",
  },
  {
    icon: Handshake,
    title: "The approach",
    body: "We removed the middlemen. No job boards, no agency fees. Direct connections between neighbours, verified identities, and transparent pricing — cash or online.",
    accent: "text-purple-600 bg-purple-50",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/20",
    border: "hover:border-purple-200",
  },
  {
    icon: Banknote,
    title: "The result",
    body: "A marketplace where tasks fill in minutes, workers earn on their own terms, and payment is as flexible as the work itself. Thousands of tasks completed every week.",
    accent: "text-emerald-600 bg-emerald-50",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/20",
    border: "hover:border-emerald-200",
  },
];

export const AboutMission = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Our Mission
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We started because getting help shouldn&apos;t be this hard
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            GetItDone exists to make everyday tasks effortless — for the people
            posting them and the people doing them.
          </p>
        </AnimatedSection>

        {/* Pillar cards */}
        <AnimatedSection stagger staggerDelay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((item) => (
              <AnimatedItem key={item.title} direction="up">
                <div
                  className={cn(
                    "group relative rounded-2xl border border-gray-100 bg-white p-7",
                    "shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    item.shadow,
                    item.border,
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      item.accent,
                    )}
                  >
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
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
