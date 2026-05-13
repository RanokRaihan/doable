import {
  BadgeCheck,
  Compass,
  MessageSquare,
  Send,
  Sparkles,
  Wallet,
} from "lucide-react";
import { AnimatedItem, AnimatedSection } from "./AnimatedSection";
import { StepCard } from "./StepCard";

const workerSteps = [
  {
    icon: Compass,
    title: "Browse the live feed",
    description:
      "Open the app and see a real-time feed of tasks near you — just like scrolling your social feed, except every post is a paid opportunity.",
  },
  {
    icon: Send,
    title: "Make an offer",
    description:
      "Found something you can do? Send your price, an estimated time, and a quick message. Stand out by being specific and responsive.",
  },
  {
    icon: MessageSquare,
    title: "Get hired & stay connected",
    description:
      "Once the poster picks you, chat directly to align on details, share your ETA, and send progress updates right inside the app.",
  },
  {
    icon: Wallet,
    title: "Get paid your way",
    description:
      "Online jobs release escrow funds to your wallet the instant the poster approves. Cash jobs close with a tap. Withdraw to your bank anytime.",
  },
  {
    icon: BadgeCheck,
    title: "Build your reputation",
    description:
      "Every completed task earns you a rating. Grow your review count, unlock the 'Super Tasker' badge, and get priority in search results.",
  },
  {
    icon: Sparkles,
    title: "Post your own tasks",
    description:
      "Remember — you're not just a worker. Whenever you need help, flip roles and post a task. Everyone here does both.",
  },
];

export const WorkerWorkflow = () => {
  return (
    <section
      id="worker-workflow"
      className="relative overflow-hidden bg-ds-bg-2 py-24"
    >
      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            For Workers
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            Turn your free time into{" "}
            <em className="italic text-ds-orange">real income</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-ds-ink-2">
            The feed looks like Instagram. The offers feel like a chat. The pay
            hits like a paycheck. No shifts, no bosses — just you choosing your
            work.
          </p>
        </AnimatedSection>

        <AnimatedSection stagger staggerDelay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workerSteps.map((step, i) => (
              <AnimatedItem key={i} direction="up">
                <StepCard
                  stepNumber={i + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  accentColor="orange"
                  className="h-full"
                />
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.2}>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "12,400+", label: "Tasks completed this month" },
              { value: "$62", label: "Average task payout" },
              { value: "4.9 ★", label: "Average worker rating" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-ds-line bg-white px-6 py-5 text-center"
                style={{
                  boxShadow:
                    "0 1px 0 rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.04)",
                }}
              >
                <p className="text-3xl font-semibold text-ds-orange">{value}</p>
                <p className="mt-1 text-[13px] text-ds-ink-3">{label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
