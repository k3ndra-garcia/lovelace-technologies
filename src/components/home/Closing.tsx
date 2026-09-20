import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/content/site";

export function Closing() {
  return (
    <section
      className="closing on-night closing--blue"
      aria-labelledby="closing-title"
    >
      <div className="container">
        <h2 id="closing-title" className="section-title" style={{ marginBottom: "2.5rem" }}>
          <span className="hole" aria-hidden="true" />
          Talk to Lovelace
        </h2>
        <LineReveal
          as="p"
          className="t-display closing__title"
          lines={["Technology should move", "your business forward.", "We make sure it does."]}
        />

        <div className="closing__options">
          <Reveal>
            <a className="closing__option" href={site.calendlyUrl} target="_blank" rel="noopener noreferrer">
              <span className="t-h3">Book a call</span>
              <span className="t-muted">
                A 30-minute introduction at a time that suits you.
                <span className="visually-hidden"> (opens Calendly in a new tab)</span>
              </span>
              <ArrowUpRight size={28} className="closing__arrow" />
            </a>
          </Reveal>
          <Reveal delay={0.08}>
            <Link className="closing__option" href="/contact">
              <span className="t-h3">Send us a note</span>
              <span className="t-muted">Tell us what you&apos;re working on and we&apos;ll follow up.</span>
              <ArrowRight size={28} className="closing__arrow" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
