"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import silhouette from "@/content/silhouette-grid.json";
import { site } from "@/content/site";
import { ease } from "@/lib/motion";
import { PunchCard } from "./PunchCard";

const PUNCH = 0.85; // seconds for the mark to punch in
const HOLD = 1.15; // when the curtain starts to lift
const LIFT = 0.6; // how long the lift takes

/**
 * Entry curtain: a block of ink blue while the mark punches itself in, then it
 * lifts to reveal the composed page. Shown once per session, and skipped
 * entirely for visitors who prefer reduced motion.
 */
export function SiteLoader() {
  const reduce = useReducedMotion();
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const seen = document.documentElement.dataset.entry === "seen";
    if (seen || reduce) {
      setShowing(false);
      return;
    }
    try {
      sessionStorage.setItem("lovelace-entry", "seen");
    } catch {
      // Private browsing: the curtain simply shows again next load.
    }
    document.documentElement.dataset.entry = "running";
    const timer = window.setTimeout(() => setShowing(false), HOLD * 1000);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  useEffect(() => {
    const root = document.documentElement;
    if (showing) root.style.overflow = "hidden";
    else root.style.removeProperty("overflow");
    return () => {
      root.style.removeProperty("overflow");
    };
  }, [showing]);

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          className="site-loader"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: LIFT, ease } }}
          aria-hidden="true"
        >
          <div className="site-loader__inner">
            <PunchCard
              grid={silhouette}
              className="site-loader__mark"
              delay={0.1}
              duration={PUNCH}
              label=""
            />
            <p className="site-loader__word">{site.name}</p>
            <span className="site-loader__rule">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD, ease: "linear" }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
