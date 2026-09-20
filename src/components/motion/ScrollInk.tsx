"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

type ScrollInkProps = {
  text: string;
  className?: string;
  as?: "p" | "h2";
};

/** Words ink in, from faint to full, as the paragraph scrolls through view. */
export function ScrollInk({ text, className, as = "p" }: ScrollInkProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });

  const Tag = as;
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </Word>
        ))}
      </span>
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span className="ink-word" style={{ opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}
