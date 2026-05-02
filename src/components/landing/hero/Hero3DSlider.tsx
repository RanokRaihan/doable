"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Hammer,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// 5-Step Workflow Data
const workflowSteps = [
  {
    id: 1,
    stepNumber: 1,
    title: "The Problem",
    subtitle: "Too much to do, too little time",
    description:
      "John needs to move heavy furniture but has no one to help him.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    icon: AlertCircle,
    accentColor: "from-red-400 to-orange-500",
    bgGradient: "from-red-50 to-orange-50",
  },
  {
    id: 2,
    stepNumber: 2,
    title: "Post Your Task",
    subtitle: "Describe what you need done",
    description: "John posts his task on Doable with details and budget.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    icon: Send,
    accentColor: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    id: 3,
    stepNumber: 3,
    title: "Helper Gets Notified",
    subtitle: "Right person, right time",
    description:
      "Mike, nearby and available, receives a notification and applies.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    icon: Bell,
    accentColor: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: 4,
    stepNumber: 4,
    title: "Task In Progress",
    subtitle: "Getting things done together",
    description: "Mike is approved and starts helping John move the furniture.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
    icon: Hammer,
    accentColor: "from-amber-400 to-yellow-500",
    bgGradient: "from-amber-50 to-yellow-50",
  },
  {
    id: 5,
    stepNumber: 5,
    title: "Mission Complete!",
    subtitle: "Happy ending for everyone",
    description: "Task done, John is satisfied, Mike gets paid. Everyone wins!",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    icon: CheckCircle2,
    accentColor: "from-green-400 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
];

const Hero3DSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % workflowSteps.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length,
    );
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  // Auto-rotate slides every 7 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, 7000);
    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      rotateY: direction > 0 ? -45 : 45,
      scale: 0.7,
      opacity: 0,
    }),
    center: {
      x: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      zIndex: 10,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.7,
      opacity: 0,
    }),
  };

  const currentSlide = workflowSteps[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div
      className="relative w-full h-130 md:h-145 flex flex-col items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Perspective Container */}
      <div
        className="relative w-full max-w-md md:max-w-lg h-105 md:h-115"
        style={{ perspective: "1200px" }}
      >
        {/* Main Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 25,
            }}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative w-full h-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
              {/* Step Badge */}
              <div
                className={`absolute top-4 left-4 z-20 w-12 h-12 rounded-2xl bg-linear-to-br ${currentSlide.accentColor} flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-lg">
                  {currentSlide.stepNumber}
                </span>
              </div>

              {/* Floating Icon */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-linear-to-br ${currentSlide.accentColor} flex items-center justify-center shadow-lg`}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </motion.div>

              {/* Illustration Area */}
              <div
                className={`relative h-[55%] w-full bg-linear-to-br ${currentSlide.bgGradient} overflow-hidden`}
              >
                <Image
                  width={600}
                  height={400}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover opacity-90"
                  priority
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />

                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-8 right-8 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center"
                >
                  <IconComponent
                    className={`w-8 h-8 bg-linear-to-br ${currentSlide.accentColor} bg-clip-text`}
                    style={{
                      color:
                        currentSlide.stepNumber === 1
                          ? "#f87171"
                          : currentSlide.stepNumber === 2
                            ? "#60a5fa"
                            : currentSlide.stepNumber === 3
                              ? "#c084fc"
                              : currentSlide.stepNumber === 4
                                ? "#fbbf24"
                                : "#34d399",
                    }}
                  />
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="p-6 h-[45%] flex flex-col justify-between">
                <div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
                  >
                    {currentSlide.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className={`text-sm font-semibold bg-linear-to-r ${currentSlide.accentColor} bg-clip-text text-transparent`}
                  >
                    {currentSlide.subtitle}
                  </motion.p>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 text-sm mt-3 leading-relaxed"
                  >
                    {currentSlide.description}
                  </motion.p>
                </div>

                {/* Progress Indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">
                      Step {currentSlide.stepNumber} of {workflowSteps.length}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${(currentSlide.stepNumber / workflowSteps.length) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full bg-linear-to-r ${currentSlide.accentColor} rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Side Preview Cards (Desktop) */}
        <div className="hidden md:block">
          {/* Left Preview */}
          {currentIndex > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.4, x: 0 }}
              className="absolute -left-25 top-1/2 -translate-y-1/2 w-45 h-70 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              onClick={goToPrev}
              style={{
                transform: "translateY(-50%) rotateY(25deg)",
                transformOrigin: "right center",
              }}
            >
              <Image
                width={180}
                height={280}
                src={workflowSteps[currentIndex - 1].image}
                alt="Previous"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-r from-white/60 to-transparent" />
            </motion.div>
          )}

          {/* Right Preview */}
          {currentIndex < workflowSteps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.4, x: 0 }}
              className="absolute -right-25 top-1/2 -translate-y-1/2 w-45 h-70 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              onClick={goToNext}
              style={{
                transform: "translateY(-50%) rotateY(-25deg)",
                transformOrigin: "left center",
              }}
            >
              <Image
                width={180}
                height={280}
                src={workflowSteps[currentIndex + 1].image}
                alt="Next"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-l from-white/60 to-transparent" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-6">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrev}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors border border-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {workflowSteps.map((step, index) => (
            <motion.button
              key={step.id}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`relative transition-all duration-300 ${
                index === currentIndex ? "w-8 h-3" : "w-3 h-3 hover:bg-gray-400"
              } rounded-full ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
            >
              {index === currentIndex && (
                <motion.div
                  layoutId="activeDot"
                  className={`absolute inset-0 rounded-full bg-linear-to-r ${step.accentColor}`}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToNext}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors border border-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Auto-play Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPaused ? 1 : 0 }}
        className="absolute bottom-2 text-xs text-gray-400 flex items-center gap-1"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Paused
      </motion.div>
    </div>
  );
};

export default Hero3DSlider;
