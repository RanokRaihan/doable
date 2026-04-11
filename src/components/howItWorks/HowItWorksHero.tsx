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
    <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 pt-28 pb-20">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-400 opacity-10 mix-blend-multiply blur-[100px]" />
      <div className="absolute top-0 right-1/4 h-72 w-72 -translate-y-1/3 rounded-full bg-purple-400 opacity-10 mix-blend-multiply blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 translate-y-1/3 rounded-full bg-indigo-300 opacity-10 mix-blend-multiply blur-[80px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Platform Guide
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mx-auto mb-6 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          A social platform where{" "}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            everyone works,
          </span>{" "}
          everyone posts.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          GetItDone blurs the line between posting and working. Today you hire
          someone to move boxes. Tomorrow you pick up a gig and earn. Pay with
          cash or online — your choice, every time.
        </motion.p>

        {/* Anchor link pills */}
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
              className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm shadow-gray-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm"
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
