"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";
import type React from "react";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

/**
 * Wraps children in a span and applies a rough-notation annotation (highlight, underline, box, etc.).
 *
 * When `isView` is true, the annotation is delayed until the element enters the viewport (uses an Intersection Observer with a -10% margin). Creates the annotation with the provided visual options and shows it; the annotation is removed on unmount or when dependencies change.
 *
 * @param children - Content to be annotated.
 * @param action - The annotation type to apply (e.g., `"highlight"`, `"underline"`, `"box"`, `"circle"`, `"strike-through"`, `"crossed-off"`, `"bracket"`).
 * @param color - Annotation color.
 * @param strokeWidth - Line stroke width used by the annotation.
 * @param animationDuration - Duration of the annotation animation in milliseconds.
 * @param iterations - Number of animation iterations.
 * @param padding - Padding (in pixels) between the annotation and the element.
 * @param multiline - Whether the annotation should support multiline elements.
 * @param isView - If true, wait until the element is in view before showing the annotation; if false, show immediately.
 * @returns A span element wrapping `children` with the annotation applied.
 */
export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  });

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView;

  useEffect(() => {
    if (!shouldShow) return;

    const element = elementRef.current;
    if (!element) return;

    const annotation = annotate(element, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    });

    annotation.show();

    return () => {
      if (element) {
        annotate(element, { type: action }).remove();
      }
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
