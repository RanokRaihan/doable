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
      {/* Subtle background accent */}
      <div className="absolute -top-32 left-0 h-64 w-64 rounded-full bg-blue-400 opacity-5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-400 opacity-5 blur-[100px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
            For Job Posters
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Post a task in minutes,{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              get it done today
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            You can be a poster at 9 AM and a worker by noon. That&apos;s the
            GetItDone way — a community where helping and hiring flow both ways.
          </p>
        </AnimatedSection>

        {/* Steps grid */}
        <AnimatedSection stagger staggerDelay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posterSteps.map((step, i) => (
              <AnimatedItem key={i} direction="up">
                <StepCard
                  stepNumber={i + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  accentColor="blue"
                  className="h-full"
                />
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>

        {/* Bottom highlight strip */}
        <AnimatedSection direction="up" delay={0.2} className="mt-14">
          <div className="mx-auto max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 px-8 py-6 text-center shadow-lg shadow-blue-500/5">
            <p className="font-semibold text-blue-900">
              💡 <span className="font-bold">Pro tip:</span> Tasks with photos
              and a clear description receive{" "}
              <span className="underline decoration-blue-400 decoration-2 underline-offset-2">
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
