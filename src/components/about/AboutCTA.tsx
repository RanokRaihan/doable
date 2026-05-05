import { AnimatedSection } from "@/components/howItWorks/AnimatedSection";
import { ArrowRight, Briefcase, ClipboardList } from "lucide-react";
import Link from "next/link";

export const AboutCTA = () => {
  return (
    <section className="relative overflow-hidden bg-ds-ink py-24">
      <div className="absolute -top-16 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-ds-orange opacity-10 blur-3xl" />
      <div className="absolute -bottom-16 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-ds-orange-soft opacity-20 blur-3xl" />

      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <AnimatedSection direction="up" className="text-center">
          <h2
            className="mx-auto max-w-3xl font-serif font-normal leading-[1.05] tracking-tight text-white"
            style={{ fontSize: "clamp(32px, 3.5vw, 52px)" }}
          >
            Ready to join the community?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] text-white/70">
            Whether you need a hand or have one to lend, there&apos;s a place
            for you here. Sign up in 60 seconds — no credit card needed.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-[52px] items-center gap-3 rounded-full bg-ds-orange px-8 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
            >
              <ClipboardList size={19} />
              Post a Task
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/register?role=helper"
              className="inline-flex h-[52px] items-center gap-3 rounded-full border border-white/25 px-8 text-[15px] font-semibold text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
            >
              <Briefcase size={19} />
              Become a Worker
              <ArrowRight size={17} />
            </Link>
          </div>

          <p className="mt-6 text-[13px] text-white/40">
            Free to join · No monthly fees · Withdraw earnings anytime
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};
