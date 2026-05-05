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
  },
  {
    icon: Zap,
    title: "Speed obsessed",
    description:
      "Post a task in under 2 minutes, receive your first offer in 15. Every interaction is designed to save time.",
  },
  {
    icon: MapPin,
    title: "Hyper-local",
    description:
      "Great work happens nearby. We connect you with skilled people in your neighbourhood — not across the globe.",
  },
  {
    icon: Wallet,
    title: "Payment flexibility",
    description:
      "Pay or get paid with cash, card, or digital wallet. Offer both options on a single task and let the other side choose.",
  },
  {
    icon: Shield,
    title: "Trust by design",
    description:
      "ID verification, community ratings, secure escrow, and a dedicated dispute team — safety is built in, not bolted on.",
  },
  {
    icon: Heart,
    title: "Fair for everyone",
    description:
      "Transparent pricing, no hidden fees, and workers keep 85% of every task payout. Tips go to them 100%.",
  },
  {
    icon: Clock,
    title: "Flexibility built in",
    description:
      "No schedules, no shifts, no commitments. Work when you want, post when you need — the platform adapts to your life.",
  },
  {
    icon: Scale,
    title: "Radical transparency",
    description:
      "Ratings are permanent and uneditable. Fees are shown upfront. Every transaction is documented in your history.",
  },
];

export const AboutValues = () => {
  return (
    <section className="relative overflow-hidden bg-ds-bg-2 py-24">
      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            Our Values
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            What we stand for
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-ds-ink-2">
            These aren&apos;t aspirational posters on a wall. They&apos;re the
            decisions we make every day when building the product.
          </p>
        </AnimatedSection>

        <AnimatedSection stagger staggerDelay={0.08}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <AnimatedItem key={item.title} direction="up">
                <div
                  className={cn(
                    "group relative rounded-2xl border border-ds-line bg-white p-6",
                    "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  )}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ds-orange-soft text-ds-orange-ink transition-transform duration-300 group-hover:scale-110">
                    <item.icon size={19} strokeWidth={1.75} />
                  </div>
                  <h3 className="mb-1.5 text-[15px] font-semibold text-ds-ink">
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
