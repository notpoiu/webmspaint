"use client";

import { motion, useInView, Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useMemo } from "react";

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

type MarginValue = `${number}${"px" | "%"}`;
type MarginType = MarginValue | `${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export default function WordFadeIn({
  words,
  delay = 0.15,
  initialDelay = 0,
  inViewMargin = -150,
  className,
  id,
  inView = false,
}: WordFadeInProps) {
  const ref = useRef(null);
  
  const memoizedMargin = useMemo(
    () => `${-inViewMargin}px 0px ${-inViewMargin}px 0px`,
    [inViewMargin]
  );
  
  const inViewResult = useInView(ref, { once: true, margin: memoizedMargin as MarginType });
  const isInView = useMemo(() => !inView || inViewResult, [inView, inViewResult]);
  const _words = useMemo(() => words.split(" "), [words]);
  
  const memoizedVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay: initialDelay + i * delay },
      }),
    }),
    [initialDelay, delay]
  );

  const renderedWords = useMemo(
    () =>
      _words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={memoizedVariants} custom={i}>
          {word}{" "}
        </motion.span>
      )),
    [_words, memoizedVariants]
  );
  
  const memoizedContent = useMemo(
    () => (
      <motion.h1
        variants={memoizedVariants}
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={cn(
          "font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]",
          className,
        )}
        id={id}
      >
        {renderedWords}
      </motion.h1>
    ),
    [memoizedVariants, isInView, className, id, renderedWords]
  );

  return memoizedContent;
}