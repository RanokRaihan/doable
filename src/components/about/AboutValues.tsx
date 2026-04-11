import {
  AnimatedItem,
  AnimatedSection,
} from "@/components/howItWorks/AnimatedSection";
import { cn } from "@/lib/utils";
import {
  Clock,
  Heart,
  MapPin,
  Scale,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Community first",
    description:
      "Every user is both a poster and a worker. The platform is shaped by the people who use it, not a corporate boardroom.",
    color: "text-blue-600 bg-blue-50",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/20",
    border: "hover:border-blue-200",
  },
  {
    icon: Zap,
    title: "Speed obsessed",
    description:
      "Post a task in under 2 minutes, receive your first offer in 15. Every interaction is designed to save time.",
    color: "text-amber-600 bg-amber-50",
    shadow: "shadow-amber-500/10 hover:shadow-amber-500/20",
    border: "hover:border-amber-200",
  },
  {
    icon: MapPin,
    title: "Hyper-local",
    description:
      "Great work happens nearby. We connect you with skilled people in your neighbourhood — not across the globe.",
    color: "text-emerald-600 bg-emerald-50",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/20",
    border: "hover:border-emerald-200",
  },
  {
    icon: Wallet,
    title: "Payment flexibility",
    description:
      "Pay or get paid with cash, card, or digital wallet. Offer both options on a single task and let the other side choose.",
    color: "text-purple-600 bg-purple-50",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/20",
    border: "hover:border-purple-200",
  },
  {
    icon: Shield,
    title: "Trust by design",
    description:
      "ID verification, community ratings, secure escrow, and a dedicated dispute team — safety is built in, not bolted on.",
    color: "text-indigo-600 bg-indigo-50",
    shadow: "shadow-indigo-500/10 hover:shadow-indigo-500/20",
    border: "hover:border-indigo-200",
  },
  {
    icon: Heart,
    title: "Fair for everyone",
    description:
      "Transparent pricing, no hidden fees, and workers keep 85% of every task payout. Tips go to them 100%.",
    color: "text-rose-600 bg-rose-50",
    shadow: "shadow-rose-500/10 hover:shadow-rose-500/20",
    border: "hover:border-rose-200",
  },
  {
    icon: Clock,
    title: "Flexibility built in",
    description:
      "No schedules, no shifts, no commitments. Work when you want, post when you need — the platform adapts to your life.",
    color: "text-teal-600 bg-teal-50",
    shadow: "shadow-teal-500/10 hover:shadow-teal-500/20",
    border: "hover:border-teal-200",
  },
  {
    icon: Scale,
    title: "Radical transparency",
    description:
      "Ratings are permanent and uneditable. Fees are shown upfront. Every transaction is documented in your history.",
    color: "text-slate-600 bg-slate-100",
    shadow: "shadow-slate-500/10 hover:shadow-slate-500/20",
    border: "hover:border-slate-200",
  },
];

export const AboutValues = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
            Our Values
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What we stand for
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            These aren&apos;t aspirational posters on a wall. They&apos;re the
            decisions we make every day when building the product.
          </p>
        </AnimatedSection>

        {/* Values grid */}
        <AnimatedSection stagger staggerDelay={0.08}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <AnimatedItem key={item.title} direction="up">
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
                      "mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      item.color,
                    )}
                  >
                    <item.icon size={19} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-1.5 font-bold text-gray-900">
                    {item.title}
                  </h3>
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
