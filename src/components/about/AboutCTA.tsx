import { AnimatedSection } from "@/components/howItWorks/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, ClipboardList } from "lucide-react";
import Link from "next/link";

export const AboutCTA = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      {/* Blobs */}
      <div className="absolute -top-16 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-600 opacity-15 mix-blend-overlay blur-3xl" />
      <div className="absolute -bottom-16 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-purple-600 opacity-15 mix-blend-overlay blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Ready to join the community?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            Whether you need a hand or have one to lend, there&apos;s a place
            for you here. Sign up in 60 seconds — no credit card needed.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-14 gap-3 rounded-full bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
              asChild
            >
              <Link href="/register">
                <ClipboardList size={19} />
                Post a Task
                <ArrowRight size={17} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 gap-3 rounded-full border-emerald-500/50 bg-emerald-900/30 px-8 text-base font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:bg-emerald-900/50 hover:text-emerald-200 hover:border-emerald-400 hover:-translate-y-0.5"
              asChild
            >
              <Link href="/register?role=helper">
                <Briefcase size={19} />
                Become a Worker
                <ArrowRight size={17} />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Free to join · No monthly fees · Withdraw earnings anytime
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};
