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
    accent: true,
  },
  {
    icon: Flame,
    year: "Early 2025",
    title: "First prototype",
    body: "A scrappy MVP launched in one neighbourhood. 80 tasks in the first week proved the concept — people wanted this.",
    accent: true,
  },
  {
    icon: Users,
    year: "Mid 2025",
    title: "Community growth",
    body: "Word spread organically. We added cash payments, real-time chat, and the reputation system. The community doubled every month.",
    accent: false,
  },
  {
    icon: Megaphone,
    year: "Late 2025",
    title: "Going public",
    body: "Thousands of verified users, full escrow support, and a mobile-first redesign. Doable became the go-to platform in 12 cities.",
    accent: false,
  },
  {
    icon: Rocket,
    year: "2026",
    title: "What’s next",
    body: "AI-powered task matching, tipping, instant bank withdrawals, and expansion into new regions. We’re just getting started.",
    accent: true,
  },
  {
    icon: Milestone,
    year: "The vision",
    title: "A global work network",
    body: "A world where anyone can earn from their skills and anyone can get help in minutes — regardless of where they live.",
    accent: false,
  },
];

export const AboutStory = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            Our Story
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            From a frustrated idea to a thriving community
          </h2>
        </AnimatedSection>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-5 top-0 bottom-0 hidden w-0.5 bg-ds-line sm:block" />

          <AnimatedSection stagger staggerDelay={0.12}>
            <div className="space-y-10">
              {timeline.map((item) => (
                <AnimatedItem key={item.year} direction="left">
                  <div className="relative flex gap-6">
                    <div className="relative z-10 hidden sm:block">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                          item.accent
                            ? "bg-ds-orange-soft text-ds-orange-ink"
                            : "bg-ds-bg-2 text-ds-ink-2",
                        )}
                      >
                        <item.icon size={18} strokeWidth={1.75} />
                      </div>
                    </div>

                    <div
                      className="group w-full rounded-2xl border border-ds-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        boxShadow:
                          "0 1px 0 rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.04)",
                      }}
                    >
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-ds-ink-3">
                        {item.year}
                      </p>
                      <h3 className="mb-2 text-[16px] font-semibold text-ds-ink">
                        {item.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-ds-ink-3">
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
