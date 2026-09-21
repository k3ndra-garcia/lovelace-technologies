"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { approach } from "@/content/site";
import { onStage, stageTints, vars } from "@/lib/css";
import { ease } from "@/lib/motion";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Pinned on large screens: the section holds while scroll advances through
 * Assess, Prioritize, Implement, Enable, and the block of colour beside the
 * stages changes with each one. Small screens and reduced motion get a stacked
 * list instead (switched in CSS, so there is no hydration flicker).
 */
export function Approach({ id = "approach" }: { id?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 60rem) and (prefers-reduced-motion: no-preference)");
    const sync = () => setShowMedia(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(approach.length - 1, Math.max(0, Math.floor(v * approach.length * 0.999)));
    setActive((current) => (current === next ? current : next));
  });

  const stage = approach[active];

  return (
    <section
      id={id}
      className="approach on-night"
      aria-labelledby={`${id}-title`}
      style={vars({ "--mark": onStage })}
    >
      <div ref={trackRef} className="approach__track">
        <div className="approach__pin">
          <div className="approach__media" aria-hidden="true">
            {showMedia && (
              <video
                className="approach__video"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/media/hero-poster.jpg"
              >
                <source src="/media/hero.mp4" type="video/mp4" />
              </video>
            )}
            <span className="approach__scrim" />
            <span className="approach__rules">
              <span />
              <span />
              <span />
              <span />
            </span>
          </div>
          <div className="approach__panes">
            <div className="approach__left">
              <div className="approach__head">
                <h2 id={`${id}-title`} className="section-title">
                  <span className="hole" aria-hidden="true" />
                  Our approach
                </h2>
                <p className="t-caption">
                  Stage {active + 1} of {approach.length}
                </p>
              </div>

              <ol className="approach__steps" aria-hidden="true">
                {approach.map((s, i) => (
                  <li
                    key={s.step}
                    className="approach__step"
                    data-state={i < active ? "done" : i === active ? "active" : "upcoming"}
                  >
                    <span className="approach__num">{pad(i)}</span>
                    {s.step}
                  </li>
                ))}
              </ol>

              <div className="approach__foot">
                <p className="t-small t-muted">One accountable team through every stage.</p>
                <div className="approach__progress" aria-hidden="true">
                  {approach.map((s, i) => (
                    <span key={s.step} data-on={i <= active} />
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="approach__right"
              animate={{ backgroundColor: stageTints[active] }}
              transition={{ duration: 0.7, ease }}
              aria-hidden="true"
            >
              <div className="approach__detail">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stage.step}
                    className="approach__panel"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
                    exit={{ opacity: 0, y: -18, transition: { duration: 0.25, ease } }}
                  >
                    <p className="t-h3">{stage.title}</p>
                    <p className="t-lead">{stage.body}</p>
                    <p className="approach__deliverable">
                      <span className="hole" aria-hidden="true" />
                      You leave this stage with: {stage.deliverable.toLowerCase()}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Full content for assistive technology, independent of scroll position. */}
          <ol className="visually-hidden">
            {approach.map((s) => (
              <li key={s.step}>
                {s.step}: {s.title}. {s.body} Outcome: {s.deliverable}.
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="approach-stack container section">
        <h2 className="section-title" style={{ marginBottom: "2rem" }}>
          <span className="hole" aria-hidden="true" />
          Our approach
        </h2>
        <p className="t-h2" style={{ marginBottom: "3rem" }}>
          Assess, prioritize, implement, enable.
        </p>
        <ol>
          {approach.map((s, i) => (
            <Reveal
              as="li"
              key={s.step}
              className="approach-stack__item"
              style={vars({ "--mark": onStage })}
            >
              <span className="approach__num">{pad(i)}</span>
              <p className="t-h3">{s.step}</p>
              <p className="t-h4">{s.title}</p>
              <p className="t-muted">{s.body}</p>
              <p className="approach__deliverable">
                <span className="hole" aria-hidden="true" />
                {s.deliverable}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
