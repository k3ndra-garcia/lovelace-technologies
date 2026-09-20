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
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
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

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className="header"
        data-scrolled={scrolled || megaOpen}
        data-hidden={hidden && !megaOpen && !menuOpen}
        data-theme={overLight && !megaOpen ? "light" : "dark"}
      >
        <div className="container header__inner">
          <Brand />
          <nav className="nav" aria-label="Main">
            <ul className="nav__list">
              {nav.map((item) =>
                item.href === "/services" ? (
                  <li
                    key={item.href}
                    className="nav__item--services"
                    onPointerEnter={openMega}
                    onPointerLeave={closeMegaSoon}
                    onFocus={openMega}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMegaSoon();
                    }}
                  >
                    <Link
                      href={item.href}
                      className="nav__link"
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      aria-expanded={megaOpen}
                      aria-controls="services-panel"
                    >
                      {item.label}
                    </Link>
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          id="services-panel"
                          className="mega"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                          transition={{ duration: 0.3, ease }}
                        >
                          <ul>
                            {services.map((s) => (
                              <li key={s.slug}>
                                <Link href={`/services/${s.slug}`} className="mega__link">
                                  <span className="mega__title">{s.title}</span>
                                  <span className="mega__summary">{s.summary}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link href="/services" className="mega__all">
                            How our services fit together
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="nav__link"
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              {site.showWorkInNav && (
                <li>
                  <Link href="/work" className="nav__link" aria-current={isCurrent("/work") ? "page" : undefined}>
                    Work
                  </Link>
                </li>
              )}
            </ul>
            <ContactTrigger size="small" />
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </nav>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
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

  const links = [...nav, ...(site.showWorkInNav ? [{ label: "Work", href: "/work" }] : [])];

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
        <button type="button" className="menu-toggle" aria-expanded="true" aria-label="Close menu" onClick={onClose} style={{ display: "block" }}>
          <span />
          <span />
        </button>
      </div>
      <nav className="menu__links" aria-label="Mobile">
        {links.map((link, i) => (
          <div key={link.href} style={{ overflow: "clip" }}>
            <motion.div {...item(i)}>
              <Link href={link.href} className="menu__link" onClick={onClose}>
                {link.label}
              </Link>
            </motion.div>
            {link.href === "/services" && (
              <motion.ul className="menu__services" {...item(i + 0.5)}>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} onClick={onClose}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        ))}
      </nav>
      <motion.div className="menu__foot" {...item(links.length)}>
        <ContactTrigger variant="light">Talk to Lovelace</ContactTrigger>
        <a href={`mailto:${site.email}`} className="t-small t-muted">
          {site.email}
        </a>
      </motion.div>
    </motion.div>
  );
}
