import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ArrowUpRight } from "@/components/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Lovelace Technologies. Book a call or send us a note about what you're working on.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title={["Talk to Lovelace."]}
        lead="Tell us a little about your organization and what you want technology to do for it. We'll follow up to find a time to talk."
      />

      <section className="container" style={{ paddingBottom: "var(--section-y)" }}>
        <div className="grid split rule-top" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)" }}>
          <aside className="split__aside" style={{ display: "grid", gap: "2.5rem", alignContent: "start" }}>
            <Reveal>
              <h2 className="t-h4">Rather talk first?</h2>
              <p className="t-muted" style={{ margin: "0.5rem 0 1.25rem" }}>
                Pick a time for a 30-minute introduction.
              </p>
              <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn">
                <span className="btn__hole" aria-hidden="true" />
                Book a call
                <ArrowUpRight size={16} />
                <span className="visually-hidden"> (opens Calendly in a new tab)</span>
              </a>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="t-h4">Email</h2>
              <a href={`mailto:${site.email}`} className="text-link">
                {site.email}
              </a>
            </Reveal>
          </aside>
          <div className="split__main">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
