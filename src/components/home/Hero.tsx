"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactTrigger } from "@/components/ContactMenu";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { PunchCard } from "@/components/PunchCard";
import silhouette from "@/content/silhouette-grid.json";
import { services } from "@/content/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Phones get the poster frame instead of a 2.8MB download.
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 48rem)");
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section ref={ref} className="hero container">
      <div className="hero__media" aria-hidden="true">
        {reduce || small ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero__video" src="/media/hero-poster.jpg" alt="" />
        ) : (
          <video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-poster.jpg"
          >
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        )}
        <span className="hero__mask" />
      </div>
      <div className="grid hero__grid">
        <motion.div className="hero__copy" style={reduce ? undefined : { y: copyY }}>
          <LineReveal
            as="h1"
            trigger="load"
            delay={0.2}
            className="t-display hero__title"
            lines={["Technology", "consulting for", "what comes next."]}
          />
          <Reveal delay={0.65} y={16}>
            <p className="t-lead hero__sub">
              Lovelace helps organizations evaluate, implement, and scale modern technology, from the
              first assessment to the day your team owns it.
            </p>
          </Reveal>
          <Reveal delay={0.8} y={16} className="hero__actions">
            <ContactTrigger />
            <Link href="#approach" className="text-link">
              See how we work
            </Link>
          </Reveal>
        </motion.div>

        <motion.div className="hero__figure" style={reduce ? undefined : { y: cardY }}>
          <PunchCard
            grid={silhouette}
            className="hero__card"
            delay={0.5}
            label="A punched card whose holes form the Lovelace silhouette"
          />
          <Reveal delay={1.9} y={8} className="hero__caption">
            <span className="hole" aria-hidden="true" style={{ marginTop: "0.3rem" }} />
            <p className="t-caption">
              Babbage&apos;s Analytical Engine read its instructions from punched cards. Ada Lovelace
              saw that it could work with far more than numbers.
            </p>
          </Reveal>
        </motion.div>
      </div>

      <Reveal delay={1.1} y={0} className="hero__foot t-small">
        <p>From assessment to implementation.</p>
        <ul className="hero__practices t-muted" aria-label="Services">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`}>
                <span className="hole" aria-hidden="true" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
