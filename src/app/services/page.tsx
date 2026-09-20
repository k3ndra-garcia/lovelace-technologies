import type { Metadata } from "next";
import Link from "next/link";
import { ContactTrigger } from "@/components/ContactMenu";
import { Closing } from "@/components/home/Closing";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { ServiceList } from "@/components/ServiceList";
import { approach, services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI enablement, software and implementation, technology audits, governance and compliance, and technology strategy.",
};

// Which practices lead at each stage of an engagement.
const byStage: Record<(typeof approach)[number]["step"], string[]> = {
  Assess: ["technology-audits", "technology-strategy"],
  Prioritize: ["technology-strategy", "governance-compliance"],
  Implement: ["software-implementation", "ai-enablement"],
  Enable: ["ai-enablement", "governance-compliance"],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title={["Five practices,", "one accountable team."]}
        lead="Engage us for a single practice or across several. Either way, the same people carry the work from diagnosis to delivery."
      >
        <ContactTrigger />
      </PageHero>

      <section className="container" style={{ paddingBottom: "var(--section-y)" }} aria-label="All services">
        <div className="grid">
          <ServiceList className="services__list--full" />
        </div>
      </section>

      <section className="section container rule-top" aria-labelledby="stages-title">
        <div className="grid split">
          <div className="split__aside">
            <h2 id="stages-title" className="section-title" style={{ marginBottom: "1.5rem" }}>
              <span className="hole" aria-hidden="true" />
              How they fit together
            </h2>
            <p className="t-h3">Each stage of our approach draws on different practices.</p>
            <Link href="/approach" className="text-link" style={{ marginTop: "1.5rem" }}>
              Read about our approach
            </Link>
          </div>
          <div className="split__main">
            <dl className="def-list">
              {approach.map((stage, i) => (
                <Reveal key={stage.step} delay={i * 0.05} className="def-list__item">
                  <dt className="t-h3">{stage.step}</dt>
                  <dd style={{ margin: 0, display: "grid", gap: "0.5rem" }}>
                    {byStage[stage.step].map((slug) => {
                      const s = services.find((x) => x.slug === slug)!;
                      return (
                        <Link key={slug} href={`/services/${slug}`} className="text-link" style={{ justifySelf: "start" }}>
                          {s.title}
                        </Link>
                      );
                    })}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Closing />
    </>
  );
}
