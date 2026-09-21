"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, services, site } from "@/content/site";
import { ease } from "@/lib/motion";
import { Brand } from "./Brand";
import { ContactTrigger } from "./ContactMenu";
import { useScrollLock } from "./motion/SmoothScroll";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overLight, setOverLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > window.innerHeight * 0.6);
        lastY = y;
      }
      // Switch to dark text while a porcelain block sits under the header.
      const probe = 36;
      let light = false;
      document.querySelectorAll<HTMLElement>("[data-header-theme='light']").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom >= probe) light = true;
      });
      setOverLight(light);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <>
      <header
        className="header"
        data-scrolled={scrolled}
        data-hidden={hidden && !menuOpen}
        data-theme={overLight ? "light" : "dark"}
      >
        <div className="container header__inner">
          <Brand />
          <nav className="nav" aria-label="Main">
            <ContactTrigger size="small" />
            <button
              type="button"
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="menu-btn__bars" aria-hidden="true">
                <span />
                <span />
              </span>
              Menu
            </button>
          </nav>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && <SiteMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function SiteMenu({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { y: "100%", opacity: 0 },
          animate: { y: "0%", opacity: 1, transition: { duration: 0.8, ease, delay: 0.25 + i * 0.06 } },
          exit: { opacity: 0, transition: { duration: 0.15 } },
        };

  const links = nav;

  return (
    <motion.div
      ref={ref}
      id="site-menu"
      className="menu on-night"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
      exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.45, ease } }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="menu__top">
        <Brand onClick={onClose} />
        <button type="button" className="menu-btn" aria-expanded="true" onClick={onClose}>
          <span className="menu-btn__bars menu-btn__bars--close" aria-hidden="true">
            <span />
            <span />
          </span>
          Close
        </button>
      </div>

      <div className="menu__grid">
        <nav className="menu__nav" aria-label="Site">
          {links.map((link, i) => (
            <div key={link.href} style={{ overflow: "clip" }}>
              <motion.div {...item(i)}>
                <Link href={link.href} className="menu__link" onClick={onClose}>
                  {link.label}
                </Link>
              </motion.div>
            </div>
          ))}
        </nav>

        <div className="menu__aside">
          <motion.div {...item(links.length)}>
            <p className="section-title" style={{ marginBottom: "1rem" }}>
              <span className="hole" aria-hidden="true" />
              Services
            </p>
            <ul className="menu__services">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} onClick={onClose}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="menu__foot" {...item(links.length + 1)}>
            <ContactTrigger>Talk to Lovelace</ContactTrigger>
            <a href={`mailto:${site.email}`} className="t-caption">
              {site.email}
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
