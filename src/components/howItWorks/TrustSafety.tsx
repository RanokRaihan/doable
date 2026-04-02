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
    color: "text-blue-600 bg-blue-50",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/20",
    border: "hover:border-blue-200",
  },
  {
    icon: Star,
    title: "Community Ratings",
    description:
      "After every task, both parties leave a review. Ratings are verified — you can't buy, fake, or delete them.",
    color: "text-yellow-600 bg-yellow-50",
    shadow: "shadow-yellow-500/10 hover:shadow-yellow-500/20",
    border: "hover:border-yellow-200",
  },
  {
    icon: Lock,
    title: "Secure Escrow",
    description:
      "For online payments, funds are held in escrow until you approve the work. No one gets paid for work they haven't done.",
    color: "text-purple-600 bg-purple-50",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/20",
    border: "hover:border-purple-200",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description:
      "If something goes wrong, our dedicated team steps in. We review evidence, mediate fairly, and issue refunds when warranted.",
    color: "text-rose-600 bg-rose-50",
    shadow: "shadow-rose-500/10 hover:shadow-rose-500/20",
    border: "hover:border-rose-200",
  },
  {
    icon: EyeOff,
    title: "Privacy Protected",
    description:
      "Your full name, phone, and address are never shared publicly. Communication happens inside the app until both sides agree.",
    color: "text-slate-600 bg-slate-100",
    shadow: "shadow-slate-500/10 hover:shadow-slate-500/20",
    border: "hover:border-slate-200",
  },
  {
    icon: HeartHandshake,
    title: "Community Standards",
    description:
      "Clear rules every user agrees to. Violations are taken seriously — repeat offenders are removed to keep the platform safe.",
    color: "text-emerald-600 bg-emerald-50",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/20",
    border: "hover:border-emerald-200",
  },
  {
    icon: ShieldAlert,
    title: "24/7 Safety Team",
    description:
      "Human reviewers are on call around the clock. Flag a concern and expect a response within hours, not days.",
    color: "text-orange-600 bg-orange-50",
    shadow: "shadow-orange-500/10 hover:shadow-orange-500/20",
    border: "hover:border-orange-200",
  },
];

export const TrustSafety = () => {
  return (
    <section
      id="trust-safety"
      className="relative overflow-hidden bg-gray-50 py-24"
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600 shadow-sm">
            Trust & Safety
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built on{" "}
            <span className="bg-linear-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              real trust
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Safety isn&apos;t an afterthought here. Every feature, from identity
            checks to escrow, is designed to protect everyone on the platform.
          </p>
        </AnimatedSection>

        {/* Trust grid */}
        <AnimatedSection stagger staggerDelay={0.08}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trustItems.map((item, i) => (
              <AnimatedItem key={i} direction="up">
                <div
                  className={cn(
                    "group relative rounded-2xl border border-gray-100 bg-white p-6",
                    "shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    item.shadow,
                    item.border,
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      item.color,
                    )}
                  >
                    <item.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">
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
