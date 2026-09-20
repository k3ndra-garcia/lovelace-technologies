"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease, stagger } from "@/lib/motion";

type LineRevealProps = {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  /** "load" plays immediately; "view" waits until the heading scrolls in. */
  trigger?: "load" | "view";
  id?: string;
};

/** Headline lines rise from behind a mask, one after another. */
export function LineReveal({
  lines,
  as = "h2",
  className,
  delay = 0,
  trigger = "view",
  id,
}: LineRevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  const play = trigger === "load" ? { animate: "shown" } : { whileInView: "shown" };

  return (
    <Tag
      id={id}
      className={className}
      initial={reduce ? false : "hidden"}
      {...play}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <motion.span
            variants={{
              hidden: { y: "105%" },
              shown: {
                y: "0%",
                transition: { duration: 1.05, ease, delay: delay + i * stagger * 1.5 },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
