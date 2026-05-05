"use client";

import { AnimatedSection } from "@/components/howItWorks/AnimatedSection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: 50_000, suffix: "+", label: "Tasks completed" },
  { value: 12_000, suffix: "+", label: "Active community members" },
  { value: 4.9, suffix: "★", label: "Average platform rating" },
  { value: 95, suffix: "%", label: "Tasks completed on time" },
];

const CountUp = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isDecimal = value % 1 !== 0;
  const displayValue = isDecimal ? value.toFixed(1) : value.toLocaleString();

  return (
    <span ref={ref} className="text-4xl font-semibold text-ds-orange sm:text-5xl">
      {inView ? (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayValue}
          {suffix}
        </motion.span>
      ) : (
        <span className="opacity-0">
          {displayValue}
          {suffix}
        </span>
      )}
    </span>
  );
};

export const AboutStats = () => {
  return (
    <section className="relative overflow-hidden bg-ds-bg py-24">
      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            By The Numbers
          </span>
          <h2
            className="mx-auto mt-4 max-w-2xl font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
            style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
          >
            Real impact, real community
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-ds-line bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                boxShadow:
                  "0 1px 0 rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.04)",
              }}
            >
              <CountUp value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-[13px] font-medium text-ds-ink-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
