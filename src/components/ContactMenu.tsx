"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { site } from "@/content/site";
import { ease } from "@/lib/motion";
import { ArrowRight, CalendarIcon, CloseIcon, NoteIcon } from "./Icons";
import { useScrollLock } from "./motion/SmoothScroll";

type Anchor = { top: number; left: number; originX: "left" | "right" };

type ContactMenuContextValue = {
  openFrom: (trigger: HTMLElement) => void;
  close: () => void;
  trigger: HTMLElement | null;
};

const ContactMenuContext = createContext<ContactMenuContextValue | null>(null);

const POPOVER_WIDTH = 416;

export function ContactMenuProvider({ children }: { children: React.ReactNode }) {
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const pathname = usePathname();

  const openFrom = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const alignRight = rect.left + rect.width / 2 > window.innerWidth / 2;
    const margin = 16;
    const left = alignRight
      ? Math.max(margin, rect.right - POPOVER_WIDTH)
      : Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - margin);
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow > 320 ? rect.bottom + 10 : Math.max(margin, rect.top - 300);
    setAnchor({ top, left, originX: alignRight ? "right" : "left" });
    setTrigger(el);
  }, []);

  const close = useCallback(() => {
    setTrigger((current) => {
      current?.focus({ preventScroll: true });
      return null;
    });
  }, []);

  useEffect(() => {
    setTrigger(null);
  }, [pathname]);

  return (
    <ContactMenuContext.Provider value={{ openFrom, close, trigger }}>
      {children}
      <AnimatePresence>
        {trigger && anchor && <ContactPopover anchor={anchor} onClose={close} />}
      </AnimatePresence>
    </ContactMenuContext.Provider>
  );
}

function ContactPopover({ anchor, onClose }: { anchor: Anchor; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  useScrollLock(true);

  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>("a, button")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onScroll = () => onClose();

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onScroll);
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        className="popover-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="popover"
        style={{
          top: anchor.top,
          left: anchor.left,
          transformOrigin: `${anchor.originX} top`,
        }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.18, ease } }
        }
        transition={{ duration: 0.38, ease }}
      >
        <div className="popover__head">
          <p id={titleId} className="t-h4">
            Talk to Lovelace
          </p>
          <button type="button" className="popover__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <a
          className="popover__option"
          href={site.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          <span className="popover__icon">
            <CalendarIcon />
          </span>
          <span>
            <span className="popover__title">Book a call</span>
            <span className="popover__desc">
              Pick a time for a 30-minute introduction.
              <span className="visually-hidden"> (opens Calendly in a new tab)</span>
            </span>
          </span>
          <ArrowRight className="popover__chev" />
        </a>

        <Link className="popover__option" href="/contact" onClick={onClose}>
          <span className="popover__icon">
            <NoteIcon />
          </span>
          <span>
            <span className="popover__title">Send us a note</span>
            <span className="popover__desc">
              Tell us what you&apos;re working on and we&apos;ll follow up.
            </span>
          </span>
          <ArrowRight className="popover__chev" />
        </Link>

        <p className="popover__foot">
          Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </motion.div>
    </>
  );
}

type ContactTriggerProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: "dark" | "light";
  size?: "default" | "small";
};

/** Primary CTA. Opens a menu offering a Calendly booking or the contact form. */
export function ContactTrigger({
  children = "Talk to Lovelace",
  className = "",
  variant = "dark",
  size = "default",
}: ContactTriggerProps) {
  const ctx = useContext(ContactMenuContext);
  const ref = useRef<HTMLButtonElement>(null);
  if (!ctx) throw new Error("ContactTrigger must be used inside ContactMenuProvider");

  const expanded = ctx.trigger !== null && ctx.trigger === ref.current;
  const classes = [
    "btn",
    variant === "light" ? "btn--light" : "",
    size === "small" ? "btn--small" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={(event) => (expanded ? ctx.close() : ctx.openFrom(event.currentTarget))}
    >
      <span className="btn__hole" aria-hidden="true" />
      {children}
    </button>
  );
}
