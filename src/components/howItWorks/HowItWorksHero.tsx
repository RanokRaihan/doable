"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  CreditCard,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

const anchorLinks = [
  { label: "For Job Posters", href: "#poster-workflow", icon: User },
  { label: "For Workers", href: "#worker-workflow", icon: Briefcase },
  { label: "Payment Options", href: "#payment", icon: CreditCard },
  { label: "Trust & Safety", href: "#trust-safety", icon: ShieldCheck },
];

export const HowItWorksHero = () => {
  return (
    <section className="relative overflow-hidden bg-ds-bg pt-28 pb-20">
      <div className="absolute top-0 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-ds-orange-soft opacity-60 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-ds-orange-soft opacity-40 blur-[80px]" />

      <div className="relative mx-auto px-8" style={{ maxWidth: 1360 }}>
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
            Platform Guide
          </span>
        </motion.div>

        <motion.h1
          className="mx-auto mb-6 max-w-4xl text-center font-serif font-normal leading-[1.05] tracking-tight text-ds-ink"
          style={{ fontSize: "clamp(36px, 4.5vw, 62px)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          A social platform where{" "}
          <em className="italic text-ds-orange">everyone works,</em> everyone
          posts.
        </motion.h1>

        <motion.p
          className="mx-auto mb-12 max-w-2xl text-center text-[18px] leading-relaxed text-ds-ink-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          Doable blurs the line between posting and working. Today you hire
          someone to move boxes. Tomorrow you pick up a gig and earn. Pay with
          cash or online — your choice, every time.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {anchorLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2 rounded-full border border-ds-line bg-white px-5 py-2.5 text-[14px] font-medium text-ds-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-ds-line-2 hover:text-ds-orange hover:shadow-sm"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ds-line bg-white text-ds-ink-3 shadow-sm"
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
