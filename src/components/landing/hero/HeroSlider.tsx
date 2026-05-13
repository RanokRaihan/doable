"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    eyebrow: "Welcome to doable",
    headline: (
      <>
        Small jobs, <em className="italic text-ds-orange">big help</em>. Right
        around the corner.
      </>
    ),
    lede: "Need a hand for an hour? Got 30 minutes to spare? doable connects neighbors with the small tasks that fill an afternoon — or fund one.",
    ctas: [
      { label: "Post a task", href: "/post-task", primary: true },
      { label: "Find work nearby", href: "/tasks", primary: false },
    ],
    meta: [
      { value: "12,400+", label: "tasks this week" },
      { value: "4.9★", label: "average rating" },
      { value: "$28", label: "avg. payout" },
    ],
  },
  {
    eyebrow: "For task posters",
    headline: (
      <>
        Got a thing? <em className="italic text-ds-orange">Post it</em> in 60
        seconds.
      </>
    ),
    lede: "Describe the task, set your budget, and pick a time. We'll surface it to vetted helpers nearby — most posts get applicants within the hour.",
    ctas: [
      { label: "Post your first task", href: "/post-task", primary: true },
      { label: "See how pricing works", href: "/how-it-works", primary: false },
    ],
    meta: [
      { value: "~14 min", label: "avg. time to first applicant" },
      { value: "Free", label: "to post" },
    ],
  },
  {
    eyebrow: "For helpers",
    headline: (
      <>
        Browse, apply, <em className="italic text-ds-orange">get picked</em>.
      </>
    ),
    lede: "See tasks that match your skills and schedule. Send a quick intro, name your price, and the poster picks who fits best. No bidding wars.",
    ctas: [
      { label: "Find tasks near me", href: "/tasks", primary: true },
      { label: "Build my profile", href: "/register", primary: false },
    ],
    meta: [
      { value: "1 in 3", label: "applications get picked" },
      { value: "$0", label: "service fee for helpers" },
    ],
  },
  {
    eyebrow: "Once you're matched",
    headline: (
      <>
        Coordinate, <em className="italic text-ds-orange">show up</em>, get it
        done.
      </>
    ),
    lede: "In-app chat keeps the details straight. Share your ETA, swap photos, and check in when you arrive. Payment is held safe until the task is complete.",
    ctas: [
      { label: "See how it works", href: "/how-it-works", primary: true },
      { label: "Read safety guide", href: "/how-it-works", primary: false },
    ],
    meta: [
      { value: "Escrow", label: "keeps both sides covered" },
      { value: "24/7", label: "support if things go sideways" },
    ],
  },
  {
    eyebrow: "When the job's done",
    headline: (
      <>
        Get <em className="italic text-ds-orange">paid fast</em>. Leave a kind
        review.
      </>
    ),
    lede: "Funds release the moment the poster confirms — usually within minutes. Both sides leave a review, and your reputation grows with every task.",
    ctas: [
      { label: "Start earning", href: "/register", primary: true },
      { label: "How payouts work", href: "/how-it-works", primary: false },
    ],
    meta: [
      { value: "< 5 min", label: "typical payout time" },
      { value: "$0", label: "cash-out fee" },
    ],
  },
];

function Slide1Scene() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full bg-ds-orange-soft blur-sm"
        style={{ left: "10%", top: "12%", width: 140, height: 140 }}
      />
      <div
        className="absolute rounded-full blur-sm"
        style={{
          right: "14%",
          bottom: "18%",
          width: 180,
          height: 180,
          background: "#e0e7ff",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 220,
          height: 220,
          background: "radial-gradient(circle at 30% 30%, #fed7aa, #f97316)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Figure A */}
      <div className="absolute" style={{ left: "18%", bottom: "22%" }}>
        <div
          className="absolute rounded-full"
          style={{
            top: -28,
            left: "50%",
            transform: "translateX(-50%)",
            width: 32,
            height: 32,
            background: "#fed7aa",
          }}
        />
        <div
          className="rounded-t-[30px] rounded-b-2xl bg-ds-ink"
          style={{ width: 60, height: 90 }}
        />
      </div>
      {/* Figure B */}
      <div
        className="absolute"
        style={{ right: "18%", bottom: "22%", transform: "scaleX(-1)" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: -28,
            left: "50%",
            transform: "translateX(-50%)",
            width: 32,
            height: 32,
            background: "#c7d2fe",
          }}
        />
        <div
          className="rounded-t-[30px] rounded-b-2xl bg-ds-ink"
          style={{ width: 60, height: 90 }}
        />
      </div>
      {/* Dashed link */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: "38%",
          width: "40%",
          height: 2,
          transform: "translateX(-50%)",
          backgroundImage: "linear-gradient(90deg, #94a3b8 50%, transparent 0)",
          backgroundSize: "8px 2px",
          backgroundRepeat: "repeat-x",
        }}
      />
      {/* Pill tags */}
      <div
        className="absolute flex items-center gap-2 bg-white border border-ds-line rounded-full px-3.5 py-2 text-[13px] font-medium text-ds-ink"
        style={{
          left: "12%",
          top: "18%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <span className="w-4.5 h-4.5 rounded-full bg-ds-orange text-white text-[11px] flex items-center justify-center">
          ?
        </span>
        Need help moving a couch
      </div>
      <div
        className="absolute flex items-center gap-2 bg-white border border-ds-line rounded-full px-3.5 py-2 text-[13px] font-medium text-ds-ink"
        style={{
          right: "8%",
          top: "30%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <span
          className="w-4.5 h-4.5 rounded-full text-white text-[11px] flex items-center justify-center"
          style={{ background: "#10b981" }}
        >
          ✓
        </span>
        I can help · 4pm
      </div>
    </div>
  );
}

function Slide2Scene() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full bg-ds-orange-soft blur-sm"
        style={{ right: "6%", top: "8%", width: 180, height: 180 }}
      />
      {/* Task post card */}
      <div
        className="absolute bg-white border border-ds-line rounded-2xl p-5"
        style={{
          left: "8%",
          top: "12%",
          width: "78%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #fed7aa, #f97316)" }}
          >
            M
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ds-ink leading-tight">
              Maya · poster
            </div>
            <div className="text-[11px] text-ds-ink-3 mt-0.5">Brooklyn, NY</div>
          </div>
        </div>
        <div className="bg-ds-bg-2 rounded-lg p-2.5 text-[15px] font-semibold text-ds-ink mb-2">
          Help me assemble an IKEA bookshelf
          <span className="inline-block w-[1.5px] h-3.5 bg-ds-orange align-middle ml-0.5 animate-pulse" />
        </div>
        <div className="bg-ds-bg-2 rounded-lg p-2.5 text-[12px] text-ds-ink-3 mb-2.5">
          It&apos;s the BILLY, 6 shelves. Tools needed but I can supply...
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div className="bg-ds-bg-2 rounded-lg p-2.5 text-[12px] text-ds-ink">
            📍 0.4 mi away
          </div>
          <div className="bg-ds-bg-2 rounded-lg p-2.5 text-[12px] text-ds-ink">
            ⏱ Sat, 2pm
          </div>
        </div>
        <div className="bg-ds-bg-2 rounded-lg p-2.5 flex justify-between items-center mb-3.5">
          <span className="text-[13px] text-ds-ink-3">Budget</span>
          <span className="text-[16px] font-semibold text-ds-ink">$45</span>
        </div>
        <div className="bg-ds-orange text-white rounded-full py-3 text-[13px] font-medium text-center">
          Post task →
        </div>
      </div>
      {/* Applicants floating card */}
      <div
        className="absolute bg-white border border-ds-line rounded-2xl p-3.5"
        style={{
          left: "6%",
          bottom: "10%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="text-[11px] uppercase tracking-widest text-ds-ink-3 mb-1.5">
          Applicants
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-ds-ink">
          <div
            className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c7d2fe, #6366f1)" }}
          >
            J
          </div>
          <div
            className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center -ml-2"
            style={{ background: "linear-gradient(135deg, #bbf7d0, #10b981)" }}
          >
            A
          </div>
          <div
            className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center -ml-2"
            style={{ background: "linear-gradient(135deg, #fde68a, #f59e0b)" }}
          >
            R
          </div>
          <span className="ml-1.5">3 applied · 8m ago</span>
        </div>
      </div>
    </div>
  );
}

function Slide3Scene() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full blur-sm"
        style={{
          left: "8%",
          top: "6%",
          width: 140,
          height: 140,
          background: "#e0e7ff",
        }}
      />
      {/* Application card */}
      <div
        className="absolute bg-white border border-ds-line rounded-2xl p-4.5"
        style={{
          left: "12%",
          top: "10%",
          right: "12%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="flex items-center gap-3 pb-3.5 border-b border-ds-line mb-3.5">
          <div className="w-10 h-10 rounded-[10px] bg-ds-orange-soft flex items-center justify-center text-xl text-ds-orange-ink shrink-0">
            📦
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ds-ink leading-snug">
              Help assemble IKEA bookshelf
            </div>
            <div className="text-[12px] text-ds-ink-3 mt-1">
              Brooklyn · Sat 2pm · 1.5h
            </div>
          </div>
          <div className="text-[16px] font-semibold text-ds-ink">$45</div>
        </div>
        <div className="text-[11px] uppercase tracking-widest text-ds-ink-3 mb-2">
          Your message
        </div>
        <div className="bg-ds-bg-2 rounded-[10px] p-2.5 text-[13px] text-ds-ink leading-snug mb-2.5">
          Hey Maya! I&apos;ve put together at least a dozen BILLYs. Got my own
          toolkit and can be there sharp at 2. — Jordan
          <span className="inline-block w-[1.5px] h-3.5 bg-ds-orange align-middle ml-0.5 animate-pulse" />
        </div>
        <div className="bg-ds-ink text-ds-bg rounded-full py-2.5 text-[13px] font-medium text-center">
          Send application
        </div>
      </div>
      {/* Match score badge */}
      <div
        className="absolute bg-white border border-ds-line rounded-2xl p-3.5"
        style={{
          right: "6%",
          bottom: "14%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="text-[11px] uppercase tracking-widest text-ds-ink-3 mb-1.5">
          Match score
        </div>
        <div className="flex items-center gap-2.5 text-[13px] font-medium text-ds-ink">
          <div
            className="w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "conic-gradient(#10b981 92%, #f2f1ec 0)" }}
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-semibold text-ds-ink">
              92
            </div>
          </div>
          <span>High match · skill + distance</span>
        </div>
      </div>
    </div>
  );
}

function Slide4Scene() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full bg-ds-orange-soft blur-sm"
        style={{ right: "10%", top: "10%", width: 140, height: 140 }}
      />
      <div
        className="absolute flex flex-col gap-3"
        style={{ inset: "14% 10%" }}
      >
        {/* Progress card */}
        <div className="bg-white border border-ds-line rounded-2xl p-4">
          <div className="flex justify-between text-[12px] font-medium mb-2">
            <strong className="text-[13px] text-ds-ink">
              IKEA bookshelf · Jordan
            </strong>
            <span className="text-ds-ink-3">In progress</span>
          </div>
          <div className="h-1.5 bg-ds-bg-2 rounded-full overflow-hidden">
            <div className="h-full w-[65%] bg-ds-orange rounded-full" />
          </div>
          <div className="flex justify-between text-[12px] font-medium text-ds-ink-3 mt-2">
            <span>Started 1:58pm</span>
            <span>~30m left</span>
          </div>
        </div>
        {/* Chat */}
        <div className="flex-1 bg-white border border-ds-line rounded-2xl p-3.5 flex flex-col gap-2 justify-end">
          <div className="max-w-[75%] bg-ds-bg-2 text-ds-ink px-3 py-2 rounded-[14px] rounded-bl-lg text-[13px] font-medium">
            Just got here, ringing the buzzer 🔔
          </div>
          <div className="max-w-[75%] self-end bg-ds-ink text-ds-bg px-3 py-2 rounded-[14px] rounded-br-lg text-[13px] font-medium">
            Coming down! 2nd floor, door&apos;s unlocked.
          </div>
          <div className="max-w-[75%] bg-ds-bg-2 text-ds-ink px-3 py-2 rounded-[14px] rounded-bl-lg text-[13px] font-medium">
            All shelves up, looks great. Photo →
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 border border-ds-line-2 rounded-full flex items-center justify-center text-[13px] font-medium text-ds-ink bg-white">
            Open chat
          </div>
          <div className="flex-1 h-10 bg-ds-ink text-ds-bg rounded-full flex items-center justify-center text-[13px] font-medium">
            Mark complete
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide5Scene() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full blur-sm"
        style={{
          left: "12%",
          top: "14%",
          width: 160,
          height: 160,
          background: "#dcfce7",
        }}
      />
      <div
        className="absolute rounded-full bg-ds-orange-soft blur-sm"
        style={{ right: "12%", bottom: "14%", width: 160, height: 160 }}
      />
      {/* Payment card */}
      <div
        className="absolute bg-white border border-ds-line rounded-3xl p-6 text-center"
        style={{
          left: "50%",
          top: "18%",
          transform: "translateX(-50%)",
          width: "64%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="w-12 h-12 rounded-full bg-[#dcfce7] text-ds-green flex items-center justify-center mx-auto mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-ds-ink-3 mb-1">
          Paid to Jordan
        </div>
        <div className="font-serif text-[44px] leading-none tracking-tight mb-3">
          $45.00
        </div>
        <div className="flex justify-center gap-1 text-ds-orange">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 9" />
            </svg>
          ))}
        </div>
        <div className="text-[13px] text-ds-ink-2 mt-2">
          &ldquo;On time, super tidy, and the shelf is rock solid.&rdquo;
        </div>
      </div>
      {/* Review floating card */}
      <div
        className="absolute bg-white border border-ds-line rounded-2xl p-3.5"
        style={{
          left: "6%",
          bottom: "14%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #fed7aa, #f97316)" }}
          >
            M
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ds-ink">
              Maya left a 5★ review
            </div>
            <div className="text-[11px] text-ds-ink-3 mt-0.5">Just now</div>
          </div>
        </div>
      </div>
      {/* Payout floating card */}
      <div
        className="absolute bg-white border border-ds-line rounded-2xl p-3.5"
        style={{
          right: "6%",
          top: "10%",
          boxShadow: "0 12px 28px -12px rgba(15,23,42,0.18)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #c7d2fe, #6366f1)" }}
          >
            J
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ds-ink">
              Payout sent
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "#10b981" }}>
              ↗ to Chase ••4421
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const scenes = [
  Slide1Scene,
  Slide2Scene,
  Slide3Scene,
  Slide4Scene,
  Slide5Scene,
];

const contentVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir * 20, filter: "blur(4px)" }),
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, y: dir * -10, filter: "blur(2px)" }),
};

const sceneVariants = {
  enter: { opacity: 0, scale: 0.96 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.03 },
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function go(index: number) {
    const next = (index + slides.length) % slides.length;
    const isForward =
      (next > current && !(current === slides.length - 1 && next === 0)) ||
      (current === slides.length - 1 && next === 0);
    setDirection(isForward ? 1 : -1);
    setCurrent(next);
  }

  function restart() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 9000);
  }

  useEffect(() => {
    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleNav(index: number) {
    go(index);
    restart();
  }

  const slide = slides[current];
  const Scene = scenes[current];

  return (
    <section className="pt-14 pb-20 bg-ds-bg">
      <div className="mx-auto px-8" style={{ maxWidth: 1360 }}>
        {/* Slide */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-16 items-center">
          {/* Left: content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ds-orange-ink bg-ds-orange-soft px-3 py-2 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-ds-orange" />
                {slide.eyebrow}
              </span>
              <h1
                className="font-serif font-normal leading-[1.04] tracking-tight text-ds-ink mb-5"
                style={
                  {
                    fontSize: "clamp(42px, 5.4vw, 68px)",
                    textWrap: "balance",
                  } as React.CSSProperties
                }
              >
                {slide.headline}
              </h1>
              <p
                className="text-[18px] text-ds-ink-2 mb-7 leading-relaxed"
                style={{ maxWidth: 520 }}
              >
                {slide.lede}
              </p>
              <div className="flex flex-wrap gap-3">
                {slide.ctas.map((cta) =>
                  cta.primary ? (
                    <Link
                      key={cta.label}
                      href={cta.href}
                      className="inline-flex items-center gap-2 h-11.5 px-5 rounded-full text-[15px] font-medium bg-ds-orange text-white transition-transform hover:-translate-y-px"
                    >
                      {cta.label}
                    </Link>
                  ) : (
                    <Link
                      key={cta.label}
                      href={cta.href}
                      className="inline-flex items-center gap-2 h-11.5 px-5 rounded-full text-[15px] font-medium border border-ds-line-2 text-ds-ink bg-transparent hover:bg-ds-bg-2 transition-all hover:-translate-y-px"
                    >
                      {cta.label}
                    </Link>
                  ),
                )}
              </div>
              <div className="flex gap-6 mt-7 text-[13px] font-medium text-ds-ink-3 leading-snug">
                {slide.meta.map((m) => (
                  <div key={m.label}>
                    <strong className="text-ds-ink text-[22px] font-semibold block leading-none mb-0.5">
                      {m.value}
                    </strong>
                    {m.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: stage */}
          <div
            className="relative bg-ds-bg-2 rounded-3xl border border-ds-line overflow-hidden"
            style={{ aspectRatio: "5 / 4.4" }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-55"
              style={{
                backgroundImage:
                  "linear-gradient(#e7e5df 1px, transparent 1px), linear-gradient(90deg, #e7e5df 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage:
                  "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="absolute inset-0"
                variants={sceneVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Scene />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-9">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => handleNav(i)}
                className={cn(
                  "h-1.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-200",
                  i === current ? "w-10.5 bg-ds-ink" : "w-7 bg-ds-line-2",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => handleNav(current - 1)}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-ds-line-2 bg-white flex items-center justify-center text-ds-ink hover:bg-ds-bg-2 transition-all hover:-translate-y-px"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => handleNav(current + 1)}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-ds-line-2 bg-white flex items-center justify-center text-ds-ink hover:bg-ds-bg-2 transition-all hover:-translate-y-px"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
