import {
  BanknoteArrowUp,
  Bell,
  ClipboardPen,
  MapPin,
  Star,
  UserCheck,
} from "lucide-react";
import { AnimatedItem, AnimatedSection } from "./AnimatedSection";
import { StepCard } from "./StepCard";

const posterSteps = [
  {
    icon: ClipboardPen,
    title: "Describe your task",
    description:
      "Give your task a title, add details, attach photos, and drop a pin on where the work needs to happen. Takes under 2 minutes.",
  },
  {
    icon: BanknoteArrowUp,
    title: "Set your budget & payment",
    description:
      "Name your price and choose how you want to pay — online (secure escrow) or cash on completion. You can offer both and let the worker pick.",
  },
  {
    icon: Bell,
    title: "Receive offers",
    description:
      "Nearby workers browse a live feed and send you offers. You get a notification for every new bid — see their profile, ratings, and past work instantly.",
  },
  {
    icon: UserCheck,
    title: "Choose your worker",
    description:
      "Compare offers side by side. Read verified reviews, check completion rates, and message candidates before you commit.",
  },
  {
    icon: MapPin,
    title: "Track & approve",
    description:
      "Your worker checks in when they arrive. Follow progress in real time and mark the task done when you're fully satisfied.",
  },
  {
    icon: Star,
    title: "Release payment & rate",
    description:
      "Online payments release from escrow the moment you approve. Cash jobs close with a digital confirmation. Leave a review to help the community.",
  },
];

export const PosterWorkflow = () => {
  return (
    <section
      id="poster-workflow"
      className="relative overflow-hidden bg-white py-24"
    >
      <div className="relative mx-auto px-8" style={{ maxWidth: 1480 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            For Job Posters
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            Post a task in minutes,{" "}
            <em className="italic text-ds-orange">Doable today</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-ds-ink-2">
            You can be a poster at 9 AM and a worker by noon. That&apos;s the
            Doable way — a community where helping and hiring flow both ways.
          </p>
        </AnimatedSection>

        <AnimatedSection stagger staggerDelay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posterSteps.map((step, i) => (
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

        <AnimatedSection direction="up" delay={0.2} className="mt-14">
          <div className="mx-auto max-w-2xl rounded-2xl border border-ds-line bg-ds-orange-soft px-8 py-6 text-center">
            <p className="text-[15px] font-semibold text-ds-ink">
              💡 <span className="font-bold">Pro tip:</span> Tasks with photos
              and a clear description receive{" "}
              <span className="underline decoration-ds-orange decoration-2 underline-offset-2">
                3× more offers
              </span>{" "}
              within the first hour.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
