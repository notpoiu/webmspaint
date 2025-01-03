"use client";

import { motion, useInView, Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { useRef } from "react";

interface WordFadeInProps {
  words: string;
  className?: string;
  delay?: number;
  variants?: Variants;
  inView?: boolean;
  initialDelay?: number;
}

export default function WordFadeIn({
  words,
  delay = 0.15,
  initialDelay = 0,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: initialDelay + (i * delay) },
    }),
  },
  className,
  inView = false,
}: WordFadeInProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: "-150px" });
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
    >
      {_words.map((word, i) => (
        <motion.span key={word} variants={variants} custom={i}>
          {word}{" "}
        </motion.span>
      ))}
    </motion.h1>
  );
}
