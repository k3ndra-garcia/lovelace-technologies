import Link from "next/link";
import { ContactTrigger } from "@/components/ContactMenu";
import { ArrowRight } from "@/components/Icons";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { PunchCard } from "@/components/PunchCard";
import silhouette from "@/content/silhouette-grid.json";
import { caseStudies } from "@/content/site";

export function Work({ heading = true }: { heading?: boolean }) {
  return (
    <section
      id="work"
      className="section container"
      aria-labelledby="work-title"
    >
      {heading && (
        <div className="work__head">
          <div>
            <h2 id="work-title" className="section-title" style={{ marginBottom: "2rem" }}>
              <span className="hole" aria-hidden="true" />
              Selected work
            </h2>
            <LineReveal as="p" className="t-h2" lines={["Results, documented", "with permission."]} />
          </div>
          <Link href="/case-studies" className="text-link">
            All case studies
          </Link>
        </div>
      )}

      {caseStudies.length > 0 ? (
        <ul className="services__list" style={{ gridColumn: "1 / -1" }}>
          {caseStudies.map((cs) => (
            <li key={cs.slug}>
              <Link href={`/case-studies/${cs.slug}`} className="service-row">
                <h3 className="t-h3 service-row__title">{cs.title}</h3>
                <p className="service-row__summary">
                  {cs.client}, {cs.sector}. {cs.summary}
                </p>
                <span className="service-row__go" aria-hidden="true">
                  <ArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="work-empty">
          <Reveal className="work-empty__card">
            <PunchCard
              grid={silhouette}
              className="ghost-card"
              delay={0.2}
              duration={1.4}
              label="A punched card whose holes form the Lovelace silhouette"
            />
          </Reveal>
          <div className="work-empty__text">
            <Reveal>
              <h3 className="t-h3">Case studies are being written up.</h3>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="t-muted" style={{ maxWidth: "32rem" }}>
                We&apos;re documenting recent engagements with our clients&apos; approval. Until they&apos;re
                published, we&apos;re happy to walk you through relevant examples on a call.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <ContactTrigger>Ask about our work</ContactTrigger>
            </Reveal>
          </div>
        </div>
      )}
    </section>
  );
}
