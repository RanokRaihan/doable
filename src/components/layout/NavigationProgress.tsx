"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completeProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 350);
  }, []);

  const startProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    setProgress(0);
    setVisible(true);

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += current < 30 ? 8 : current < 60 ? 4 : current < 80 ? 1.5 : 0.5;
      if (current >= 85) {
        clearInterval(intervalRef.current!);
        current = 85;
      }
      setProgress(current);
    }, 80);
  }, []);

  // Intercept internal link clicks to start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href === "#" ||
        anchor.target === "_blank"
      )
        return;

      if (href === pathname) return;

      startProgress();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, startProgress]);

  // When pathname changes, the navigation is complete — finish the bar
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    startTransition(completeProgress);
  }, [pathname, completeProgress]);

  return (
    <div
      aria-hidden
      className={cn(
        "fixed top-0 left-0 z-9999 h-[2.5px] transition-all ease-out pointer-events-none",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        width: `${progress}%`,
        transitionDuration: progress === 100 ? "200ms" : "80ms",
        background: "linear-gradient(to right, #3b82f6, #6366f1)",
        boxShadow: "0 0 8px 1px rgba(99,102,241,0.6)",
      }}
    />
  );
}
