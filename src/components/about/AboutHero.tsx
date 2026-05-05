"use client";

import { motion } from "framer-motion";

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-ds-bg pt-28 pb-24">
      <div className="absolute top-10 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-ds-orange-soft opacity-60 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-ds-orange-soft opacity-40 blur-[100px]" />

      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            About Doable
          </span>
        </motion.div>

        <motion.h1
          className="mx-auto max-w-4xl text-center font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
          style={{ fontSize: "clamp(36px, 4.5vw, 62px)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Where every person is a{" "}
          <em className="italic text-ds-orange">worker</em> and every person is
          a <em className="italic text-ds-orange">poster</em>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-center text-[18px] leading-relaxed text-ds-ink-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          Doable is a community-powered marketplace that blurs the line between
          hiring and working. Today you post a job; tomorrow you pick one up. No
          corporate gatekeeping — just real people, real tasks, real earnings.
        </motion.p>
      </div>
    </section>
  );
};
