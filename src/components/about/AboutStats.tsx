"use client";

import { AnimatedSection } from "@/components/howItWorks/AnimatedSection";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: 50_000,
    suffix: "+",
    label: "Tasks completed",
    color: "text-blue-600",
  },
  {
    value: 12_000,
    suffix: "+",
    label: "Active community members",
    color: "text-purple-600",
  },
  {
    value: 4.9,
    suffix: "★",
    label: "Average platform rating",
    color: "text-amber-500",
  },
  {
    value: 95,
    suffix: "%",
    label: "Tasks completed on time",
    color: "text-emerald-600",
  },
];

const CountUp = ({
  value,
  suffix,
  color,
}: {
  value: number;
  suffix: string;
  color: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Determine display precision based on whether it contains a decimal
  const isDecimal = value % 1 !== 0;
  const displayValue = isDecimal ? value.toFixed(1) : value.toLocaleString();

  return (
    <span
      ref={ref}
      className={cn("text-4xl font-extrabold sm:text-5xl", color)}
    >
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
    <section className="relative overflow-hidden bg-white py-24">
      {/* Subtle blob */}
      <div className="absolute left-1/2 top-0 h-64 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200 opacity-10 blur-[120px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            By The Numbers
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Real impact, real community
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                color={stat.color}
              />
              <p className="mt-2 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
