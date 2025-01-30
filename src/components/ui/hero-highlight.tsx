"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import React, { useRef, useMemo } from "react";

export const Highlight = ({
  children,
  inView = false,
  inViewMargin = "-50px",
  animationSpeed = 1,
  className,
}: {
  children: React.ReactNode;
  inView?: boolean;
  inViewMargin?: string;
  animationSpeed?: number;
  className?: string;
}) => {
  const ref = useRef(null);

  // @ts-expect-error inViewMargin is set to string
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const initial = useMemo(
    () => ({
      display: "hidden",
      backgroundSize: "0% 100%",
    }),
    []
  );

  const animate = useMemo(
    () =>
      isInView
        ? {
            backgroundSize: "100% 100%",
          }
        : "hidden",
    [isInView]
  );

  const transition = useMemo(
    () => ({
      duration: 2 / animationSpeed,
      ease: "linear",
      delay: 0.5,
    }),
    [animationSpeed]
  );

  const memoizedStyle = useMemo(
    () => ({
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center",
      display: "inline",
    }),
    []
  );

  const computedClassName = useMemo(
    () =>
      cn(
        `relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
        className
      ),
    [className]
  );

  return (
    <motion.span
      initial={initial}
      animate={animate}
      transition={transition}
      style={memoizedStyle}
      className={computedClassName}
      ref={ref}
    >
      {children}
    </motion.span>
  );
};
