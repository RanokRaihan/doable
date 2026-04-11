"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

const getVariants = (direction: Direction, duration: number): Variants => {
  const offsets: Record<Direction, { x?: number; y?: number }> = {
    up: { y: 40 },
    left: { x: -40 },
    right: { x: 40 },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...offsets[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
};

const staggerContainerVariants = (staggerDelay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.05,
    },
  },
});

/**
 * AnimatedSection — Framer Motion scroll-reveal wrapper.
 *
 * When `stagger` is true, acts as a stagger container and its direct children
 * should each be wrapped in <AnimatedItem> (exported below).
 */
export const AnimatedSection = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.55,
  className,
  stagger = false,
  staggerDelay = 0.12,
}: AnimatedSectionProps) => {
  const variants = stagger
    ? staggerContainerVariants(staggerDelay)
    : getVariants(direction, duration);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={!stagger ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimatedItem — individual child when used inside a stagger AnimatedSection.
 */
interface AnimatedItemProps {
  children: ReactNode;
  direction?: Direction;
  duration?: number;
  className?: string;
}

export const AnimatedItem = ({
  children,
  direction = "up",
  duration = 0.55,
  className,
}: AnimatedItemProps) => {
  const variants = getVariants(direction, duration);

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
};
