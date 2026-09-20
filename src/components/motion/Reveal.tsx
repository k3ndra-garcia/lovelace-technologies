"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "p" | "figure";
};

/** Fades and lifts content once as it enters the viewport. */
export function Reveal({ children, className, style, delay = 0, y = 24, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: duration.slow, ease, delay }}
    >
      {children}
    </Tag>
  );
}
