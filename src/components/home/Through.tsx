"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { approach } from "@/content/site";

const centers = [12.5, 37.5, 62.5, 87.5];

const points = [
  {
    title: "No handoff gap",
    body: "The team that learns your environment is the team that carries out the plan, so context isn't lost between phases.",
  },
  {
    title: "Plans we can deliver",
    body: "Because we implement, our roadmaps are grounded in what can realistically be built, bought, and adopted.",
  },
  {
    title: "Finished means adopted",
    body: "An engagement is done when your people are using what we put in place, not when the final document is sent.",
  },
];

export function Through() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));

  // Advisory track covers the first half of the lane; Lovelace covers all of it.
  const advisoryScale = useTransform(progress, [0, 0.45], [0, 1]);
  const lovelaceScale = useTransform(progress, [0.05, 0.95], [0, 1]);
  const dashOpacity = useTransform(progress, [0.45, 0.6], [0, 1]);
  const endOpacity = useTransform(progress, [0.85, 1], [0, 1]);

  return (
    <section className="section" aria-labelledby="through-title">
      <div className="container">
      <div className="grid">
        <div className="through__head">
          <h2 id="through-title" className="section-title" style={{ marginBottom: "2rem" }}>
            <span className="hole" aria-hidden="true" />
            Strategy through implementation
          </h2>
          <LineReveal
            as="p"
            className="t-h2"
            lines={["Most consulting ends with", "a recommendation. Ours", "ends with working systems."]}
          />
          <Reveal>
            <p className="t-lead">
              A plan only creates value once it&apos;s in place. We carry the work from the first
              assessment through launch and adoption, with the same people accountable at every
              stage.
            </p>
          </Reveal>
        </div>
      </div>

      <div
        ref={ref}
        className="tracks"
        role="img"
        aria-label="Comparison: advisory-only firms stop after assessment and prioritization and hand off a report. Lovelace continues through implementation and enablement."
      >
        <div className="tracks__stages" aria-hidden="true">
          <span className="tracks__spacer" />
          {approach.map((s) => (
            <span key={s.step} className="tracks__stage">
              {s.step}
            </span>
          ))}
        </div>

        <div className="track" aria-hidden="true">
          <div className="track__label">
            <strong>Advisory-only firms</strong>
            <span className="t-caption">Hand off a report</span>
          </div>
          <div className="track__lane">
            <motion.span className="track__dash" style={{ left: "50%", right: "0%", opacity: dashOpacity }} />
            <motion.span className="track__line" style={{ width: "50%", scaleX: advisoryScale }} />
            {centers.map((c, i) =>
              i < 2 ? (
                <Hole key={c} left={c} progress={progress} at={0.45 * (c / 50)} />
              ) : (
                <Hole key={c} left={c} progress={progress} at={0.55 + i * 0.03} empty />
              ),
            )}
            <motion.span className="track__end" style={{ left: "50%", opacity: dashOpacity }}>
              Report delivered
            </motion.span>
          </div>
        </div>

        <div className="track" aria-hidden="true">
          <div className="track__label">
            <strong>Lovelace</strong>
            <span className="t-caption">Stay through adoption</span>
          </div>
          <div className="track__lane">
            <motion.span
              className="track__line track__line--accent"
              style={{ width: "100%", scaleX: lovelaceScale }}
            />
            {centers.map((c) => (
              <Hole key={c} left={c} progress={progress} at={0.05 + 0.9 * (c / 100)} accent />
            ))}
            <motion.span
              className="track__end track__end--right"
              style={{ opacity: endOpacity }}
            >
              Teams running it
            </motion.span>
          </div>
        </div>
      </div>

      <ul className="through__points">
        {points.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.08} className="through__point">
            <span className="hole" aria-hidden="true" />
            <h3 className="t-h4">{p.title}</h3>
            <p className="t-muted">{p.body}</p>
          </Reveal>
        ))}
      </ul>
      </div>
    </section>
  );
}

function Hole({
  left,
  progress,
  at,
  accent,
  empty,
}: {
  left: number;
  progress: MotionValue<number>;
  at: number;
  accent?: boolean;
  empty?: boolean;
}) {
  const scale = useTransform(progress, [at - 0.04, at], [0, 1]);
  const cls = ["track__hole", accent && "track__hole--accent", empty && "track__hole--empty"]
    .filter(Boolean)
    .join(" ");
  return <motion.span className={cls} style={{ left: `${left}%`, scale }} />;
}
