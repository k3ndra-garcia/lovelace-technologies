import type { Metadata } from "next";
import { ContactTrigger } from "@/components/ContactMenu";
import { Closing } from "@/components/home/Closing";
import { Founders } from "@/components/home/Founders";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lovelace Technologies was founded by Georgia Tech graduates to help organizations move from technology strategy to working systems.",
};

const principles = [
  {
    title: "Say it plainly",
    body: "Findings and recommendations written for the people who have to act on them, not to impress them.",
  },
  {
    title: "Own the outcome",
    body: "We measure our work by what's running and in use, and we stay until it is.",
  },
  {
    title: "Fit the organization",
    body: "Right-sized plans, policies, and tools for your budget, team, and pace, not a template from somewhere else.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={["Fluent in technology.", "Grounded in business."]}
        lead="Lovelace Technologies is a boutique consulting firm for organizations that want technology decisions made carefully and carried through completely."
      >
        <ContactTrigger />
      </PageHero>

      <Founders showLink={false} />

      <section className="section container" aria-labelledby="name-title">
        <div className="grid split">
          <div className="split__aside">
            <h2 id="name-title" className="section-title">
              <span className="hole" aria-hidden="true" />
              Why Lovelace
            </h2>
          </div>
          <div className="split__main prose">
            <Reveal>
              <p className="t-statement">
                In 1843, Ada Lovelace published her notes on Charles Babbage&apos;s Analytical Engine, a
                machine designed to take its instructions from punched cards.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="t-lead" style={{ color: "var(--ink)" }}>
                Her notes included what is widely regarded as the first published computer program. They
                also held a rarer insight: that such a machine could work with far more than numbers.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="t-muted">
                We took her name because that combination, rigorous with the details and clear about
                what&apos;s possible, is what we want every client to experience. The punched card in our
                visual identity is a nod to the same story.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section container rule-top" aria-labelledby="principles-title">
        <div className="grid split">
          <div className="split__aside">
            <h2 id="principles-title" className="section-title">
              <span className="hole" aria-hidden="true" />
              How we work
            </h2>
          </div>
          <dl className="split__main def-list">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05} className="def-list__item">
                <dt className="t-h3">{p.title}</dt>
                <dd className="t-muted" style={{ margin: 0 }}>
                  {p.body}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <Closing />
    </>
  );
}
