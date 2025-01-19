"use client";

import { motion, useInView, Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { useRef } from "react";

interface WordFadeInProps {
  words: string;
  className?: string;
  id?: string,
  delay?: number;
  variants?: Variants;
  inView?: boolean;
  inViewMargin?: number;
  initialDelay?: number;
}

export default function WordFadeIn({
  words,
  delay = 0.15,
  initialDelay = 0,
  inViewMargin = -150,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: initialDelay + (i * delay) },
    }),
  },
  className, id,
  inView = false,
}: WordFadeInProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: `${-inViewMargin}px 0px ${-inViewMargin}px 0px` });
  const isInView = !inView || inViewResult;
  
  const _words = words.split(" ");

  return (
    <motion.h1
      variants={variants}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]",
        className,
      )}
      id={id}
    >
      {_words.map((word, i) => (
        <motion.span key={word} variants={variants} custom={i}>
          {word}{" "}
        </motion.span>
      ))}
    </motion.h1>
  );
}
