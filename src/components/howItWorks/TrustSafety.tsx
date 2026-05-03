import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  EyeOff,
  HeartHandshake,
  Lock,
  Scale,
  ShieldAlert,
  Star,
} from "lucide-react";
import { AnimatedItem, AnimatedSection } from "./AnimatedSection";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Verified Identities",
    description:
      "Every user completes ID verification before posting or accepting high-value tasks. We know who's on the platform.",
  },
  {
    icon: Star,
    title: "Community Ratings",
    description:
      "After every task, both parties leave a review. Ratings are verified — you can't buy, fake, or delete them.",
  },
  {
    icon: Lock,
    title: "Secure Escrow",
    description:
      "For online payments, funds are held in escrow until you approve the work. No one gets paid for work they haven't done.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description:
      "If something goes wrong, our dedicated team steps in. We review evidence, mediate fairly, and issue refunds when warranted.",
  },
  {
    icon: EyeOff,
    title: "Privacy Protected",
    description:
      "Your full name, phone, and address are never shared publicly. Communication happens inside the app until both sides agree.",
  },
  {
    icon: HeartHandshake,
    title: "Community Standards",
    description:
      "Clear rules every user agrees to. Violations are taken seriously — repeat offenders are removed to keep the platform safe.",
  },
  {
    icon: ShieldAlert,
    title: "24/7 Safety Team",
    description:
      "Human reviewers are on call around the clock. Flag a concern and expect a response within hours, not days.",
  },
];

export const TrustSafety = () => {
  return (
    <section
      id="trust-safety"
      className="relative overflow-hidden bg-ds-bg-2 py-24"
    >
      <div className="relative mx-auto px-8" style={{ maxWidth: 1480 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            Trust & Safety
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            Built on <em className="italic text-ds-orange">real trust</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-ds-ink-2">
            Safety isn&apos;t an afterthought here. Every feature, from identity
            checks to escrow, is designed to protect everyone on the platform.
          </p>
        </AnimatedSection>

        <AnimatedSection stagger staggerDelay={0.08}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trustItems.map((item, i) => (
              <AnimatedItem key={i} direction="up">
                <div
                  className={cn(
                    "group relative rounded-2xl border border-ds-line bg-white p-6",
                    "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  )}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ds-orange-soft text-ds-orange-ink transition-transform duration-300 group-hover:scale-110">
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 text-[15px] font-semibold text-ds-ink">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-ds-ink-3">
                    {item.description}
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
