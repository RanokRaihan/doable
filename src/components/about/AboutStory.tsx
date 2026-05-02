import {
  AnimatedItem,
  AnimatedSection,
} from "@/components/howItWorks/AnimatedSection";
import { cn } from "@/lib/utils";
import {
  Flame,
  Lightbulb,
  Megaphone,
  Milestone,
  Rocket,
  Users,
} from "lucide-react";

const timeline = [
  {
    icon: Lightbulb,
    year: "2024",
    title: "The spark",
    body: "Two friends needed a plumber and a dog-walker on the same day. Five apps later, nothing. Doable was born out of frustration.",
    color: "text-amber-600 bg-amber-50",
    lineColor: "bg-amber-200",
  },
  {
    icon: Flame,
    year: "Early 2025",
    title: "First prototype",
    body: "A scrappy MVP launched in one neighbourhood. 80 tasks in the first week proved the concept — people wanted this.",
    color: "text-rose-600 bg-rose-50",
    lineColor: "bg-rose-200",
  },
  {
    icon: Users,
    year: "Mid 2025",
    title: "Community growth",
    body: "Word spread organically. We added cash payments, real-time chat, and the reputation system. The community doubled every month.",
    color: "text-blue-600 bg-blue-50",
    lineColor: "bg-blue-200",
  },
  {
    icon: Megaphone,
    year: "Late 2025",
    title: "Going public",
    body: "Thousands of verified users, full escrow support, and a mobile-first redesign. Doable became the go-to platform in 12 cities.",
    color: "text-purple-600 bg-purple-50",
    lineColor: "bg-purple-200",
  },
  {
    icon: Rocket,
    year: "2026",
    title: "What&apos;s next",
    body: "AI-powered task matching, tipping, instant bank withdrawals, and expansion into new regions. We\u2019re just getting started.",
    color: "text-emerald-600 bg-emerald-50",
    lineColor: "bg-emerald-200",
  },
  {
    icon: Milestone,
    year: "The vision",
    title: "A global work network",
    body: "A world where anyone can earn from their skills and anyone can get help in minutes — regardless of where they live.",
    color: "text-indigo-600 bg-indigo-50",
    lineColor: "bg-indigo-200",
  },
];

export const AboutStory = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
            Our Story
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From a frustrated idea to a thriving community
          </h2>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 hidden w-0.5 bg-gray-200 sm:block" />

          <AnimatedSection stagger staggerDelay={0.12}>
            <div className="space-y-10">
              {timeline.map((item) => (
                <AnimatedItem key={item.year} direction="left">
                  <div className="relative flex gap-6">
                    {/* Dot / icon */}
                    <div className="relative z-10 hidden sm:block">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md",
                          item.color,
                        )}
                      >
                        <item.icon size={18} strokeWidth={1.75} />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="group w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                        {item.year}
                      </p>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
