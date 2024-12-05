"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

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

  return (
    <motion.span
      initial={{
        display: "hidden",
        backgroundSize: "0% 100%",
      }}
      animate={isInView ? {
        backgroundSize: "100% 100%",
      } : "hidden"}
      transition={{
        duration: 2 / animationSpeed,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block pb-1   px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
        className
      )}
      ref={ref}
      
    >
      {children}
    </motion.span>
  );
};
