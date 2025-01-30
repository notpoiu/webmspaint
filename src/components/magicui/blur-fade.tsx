"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  UseInViewOptions,
  Variants,
} from "framer-motion";
import { useMemo, memo } from "react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

const BlurFade = memo(function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = useMemo(
    () => ({
      hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
      visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
    }),
    [yOffset, blur]
  );

  const combinedVariants = useMemo(
    () => variant || defaultVariants,
    [variant, defaultVariants]
  );

  const transitionConfig = useMemo(
    () => ({
      delay: 0.04 + delay,
      duration,
      ease: "easeOut",
    }),
    [delay, duration]
  );

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="hidden"
      variants={combinedVariants}
      transition={transitionConfig}
      className={className}
    >
      {useMemo(() => children, [children])}
    </motion.div>
  );
});

export default BlurFade;
