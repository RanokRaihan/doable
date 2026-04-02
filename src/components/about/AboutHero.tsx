"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 pt-28 pb-24">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-400 opacity-10 mix-blend-multiply blur-[120px]" />
      <div className="absolute top-10 right-1/4 h-72 w-72 rounded-full bg-purple-400 opacity-10 mix-blend-multiply blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 h-56 w-md -translate-x-1/2 translate-y-1/3 rounded-full bg-indigo-300 opacity-8 mix-blend-multiply blur-[100px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
            <Sparkles size={13} />
            About GetItDone
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mx-auto max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Where every person is a{" "}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            worker
          </span>{" "}
          and every person is a{" "}
          <span className="bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            poster
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          GetItDone is a community-powered marketplace that blurs the line
          between hiring and working. Today you post a job; tomorrow you pick
          one up. No corporate gatekeeping — just real people, real tasks, real
          earnings.
        </motion.p>
      </div>
    </section>
  );
};
