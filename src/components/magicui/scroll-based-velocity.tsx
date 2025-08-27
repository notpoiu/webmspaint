"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollVelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ScrollVelocityContext = React.createContext<MotionValue<number> | null>(
  null,
);

/**
 * Provides a MotionValue-based scroll velocity factor to descendants and wraps children in a full-width container.
 *
 * This component reads the page vertical scroll velocity, applies a spring-based smoothing filter, converts the
 * smoothed velocity into a signed, bounded "velocity factor" (preserving sign, clamped in magnitude to 5), and
 * supplies that MotionValue via ScrollVelocityContext for descendant rows to consume.
 *
 * The component renders a relative, full-width div that forwards any HTML div props (including children and className).
 *
 * @returns A JSX element that supplies the computed velocity factor via ScrollVelocityContext and renders the container.
 */
export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ScrollVelocityContext.Provider value={velocityFactor}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </ScrollVelocityContext.Provider>
  );
}

/**
 * Renders a horizontally scrolling row that uses a shared scroll velocity factor when available,
 * falling back to a local velocity calculation otherwise.
 *
 * The component reads `ScrollVelocityContext`; if a shared `MotionValue<number>` is present it
 * forwards `props` and that velocity to `ScrollVelocityRowImpl`. If not, it renders
 * `ScrollVelocityRowLocal` with the same props.
 *
 * @param props - Props for the scrolling row (forwarded to the chosen implementation).
 */
export function ScrollVelocityRow(props: ScrollVelocityRowProps) {
  const sharedVelocityFactor = useContext(ScrollVelocityContext);
  if (sharedVelocityFactor) {
    return (
      <ScrollVelocityRowImpl {...props} velocityFactor={sharedVelocityFactor} />
    );
  }
  return <ScrollVelocityRowLocal {...props} />;
}

interface ScrollVelocityRowImplProps extends ScrollVelocityRowProps {
  velocityFactor: MotionValue<number>;
}

/**
 * Horizontally auto-scrolling row that drives a looping marquee from a provided velocity factor.
 *
 * This component duplicates its `children` to produce a seamless, wrap-around horizontal marquee and
 * animates their horizontal position (using a MotionValue) based on the provided `velocityFactor`.
 * Animation is paused when the row is not in the viewport, when the page is hidden, or when content
 * width is not yet measured. It respects the user's `prefers-reduced-motion` setting by disabling
 * velocity-based speed multipliers.
 *
 * @param children - Content to render inside the scrolling row. This content will be duplicated.
 * @param baseVelocity - Base speed as a percentage of the content width per second (default: 5).
 *   Higher values make the marquee move faster; the final movement also scales with `velocityFactor`.
 * @param direction - Initial horizontal direction: `1` for left-to-right, `-1` for right-to-left.
 *   The visible scroll velocity can invert this direction while scrolling.
 * @param velocityFactor - MotionValue<number> used to influence speed and direction; its magnitude
 *   is clamped to 5 and its sign influences scrolling direction.
 * @param className - Additional CSS classes applied to the outer container.
 * @returns A React element rendering the animated, duplicated content suitable for a continuous marquee.
 */
function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  ...props
}: ScrollVelocityRowImplProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [numCopies, setNumCopies] = useState(1);

  const baseX = useMotionValue(0);
  const baseDirectionRef = useRef<number>(direction >= 0 ? 1 : -1);
  const currentDirectionRef = useRef<number>(direction >= 0 ? 1 : -1);
  const unitWidth = useMotionValue(0);

  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    if (!container || !block) return;

    const updateSizes = () => {
      const cw = container.offsetWidth || 0;
      const bw = block.scrollWidth || 0;
      unitWidth.set(bw);
      const nextCopies = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1;
      setNumCopies((prev) => (prev === nextCopies ? prev : nextCopies));
    };

    updateSizes();

    const ro = new ResizeObserver(updateSizes);
    ro.observe(container);
    ro.observe(block);

    const io = new IntersectionObserver(([entry]) => {
      isInViewRef.current = entry.isIntersecting;
    });
    io.observe(container);

    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility, {
      passive: true,
    });
    handleVisibility();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePRM = () => {
      prefersReducedMotionRef.current = mq.matches;
    };
    mq.addEventListener("change", handlePRM);
    handlePRM();

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      mq.removeEventListener("change", handlePRM);
    };
  }, [children, unitWidth]);

  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1;
    const offset = Number(v) || 0;
    return `${-wrap(0, width, offset)}px`;
  });

  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !isPageVisibleRef.current) return;
    const dt = delta / 1000;
    const vf = velocityFactor.get();
    const absVf = Math.min(5, Math.abs(vf));
    const speedMultiplier = prefersReducedMotionRef.current ? 1 : 1 + absVf;

    if (absVf > 0.1) {
      const scrollDirection = vf >= 0 ? 1 : -1;
      currentDirectionRef.current = baseDirectionRef.current * scrollDirection;
    }

    const bw = unitWidth.get() || 0;
    if (bw <= 0) return;
    const pixelsPerSecond = (bw * baseVelocity) / 100;
    const moveBy =
      currentDirectionRef.current * pixelsPerSecond * speedMultiplier * dt;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
    >
      <motion.div
        className="inline-flex items-center will-change-transform transform-gpu select-none"
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            aria-hidden={i !== 0}
            className="inline-flex shrink-0 items-center"
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Renders a scrolling row that derives its velocity from the page's vertical scroll when no shared velocity context is available.
 *
 * Computes a smoothed local scroll velocity from `useScroll()` → `useVelocity()` → `useSpring()` (damping: 50, stiffness: 400), maps that smoothed velocity to a bounded `velocityFactor` that preserves sign and scales magnitude to at most 5, and passes it to `ScrollVelocityRowImpl`.
 *
 * @returns A `ScrollVelocityRowImpl` element configured with a locally computed `velocityFactor`.
 */
function ScrollVelocityRowLocal(props: ScrollVelocityRowProps) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });
  return (
    <ScrollVelocityRowImpl {...props} velocityFactor={localVelocityFactor} />
  );
}
