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
      className="relative overflow-hidden bg-gray-50 py-24"
    >
      {/* Subtle background accent */}
      <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-emerald-400 opacity-5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-400 opacity-5 blur-[100px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
            For Workers
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Turn your free time into{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              real income
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            The feed looks like Instagram. The offers feel like a chat. The pay
            hits like a paycheck. No shifts, no bosses — just you choosing your
            work.
          </p>
        </AnimatedSection>

        {/* Steps grid */}
        <AnimatedSection stagger staggerDelay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workerSteps.map((step, i) => (
              <AnimatedItem key={i} direction="up">
                <StepCard
                  stepNumber={i + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  accentColor="green"
                  className="h-full"
                />
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>

        {/* Social proof mini-stat strip */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "12,400+", label: "Tasks completed this month" },
              { value: "$62", label: "Average task payout" },
              { value: "4.9 ★", label: "Average worker rating" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-emerald-100 bg-white px-6 py-5 text-center shadow-md shadow-emerald-500/5"
              >
                <p className="text-3xl font-extrabold text-emerald-600">
                  {value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
